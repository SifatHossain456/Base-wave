// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ArenaNFT} from "./ArenaNFT.sol";

/**
 * @title BaseArena
 * @notice On-chain prediction tournament platform on Base mainnet.
 *         Users predict asset price direction. Chainlink oracles resolve outcomes.
 *         Winners split the prize pool and receive NFT trophies.
 */
contract BaseArena is ReentrancyGuard, Ownable {
    // ─────────────────── Types ───────────────────

    struct Tournament {
        address creator;
        string  asset;
        address priceFeed;
        uint256 entryFee;
        uint256 prizePool;
        uint256 startTime;
        uint256 endTime;
        uint256 startPrice;
        uint256 finalPrice;
        uint32  participantCount;
        uint32  maxParticipants;
        bool    resolved;
        bool    directionUp; // majority-predicted direction (for display only)
    }

    struct Prediction {
        address predictor;
        uint256 predictedPrice;
        bool    direction; // true = UP, false = DOWN
        bool    claimed;
    }

    // ─────────────────── State ───────────────────

    uint256 public constant PLATFORM_FEE_BPS = 500; // 5%
    uint256 public tournamentCount;

    ArenaNFT public immutable nft;

    mapping(uint256 => Tournament) public tournaments;
    mapping(uint256 => mapping(address => Prediction)) public predictions;
    mapping(uint256 => address[]) public participants;

    /// @dev Chainlink price feed addresses on Base mainnet
    mapping(string => address) public priceFeeds;

    // ─────────────────── Events ───────────────────

    event TournamentCreated(uint256 indexed tournamentId, address indexed creator, string asset);
    event TournamentEntered(uint256 indexed tournamentId, address indexed participant);
    event PredictionSubmitted(uint256 indexed tournamentId, address indexed predictor, uint256 price, bool direction);
    event TournamentResolved(uint256 indexed tournamentId, uint256 finalPrice, uint256 winnerCount);
    event RewardClaimed(uint256 indexed tournamentId, address indexed winner, uint256 amount);

    // ─────────────────── Errors ───────────────────

    error TournamentNotFound();
    error TournamentFull();
    error TournamentNotActive();
    error TournamentAlreadyResolved();
    error AlreadyEntered();
    error NotParticipant();
    error AlreadyClaimed();
    error InsufficientFee();
    error ResolutionTooEarly();
    error NotWinner();

    // ─────────────────── Constructor ───────────────────

    constructor(address _nft) Ownable(msg.sender) {
        nft = ArenaNFT(_nft);

        // Base mainnet Chainlink price feeds
        priceFeeds["ETH"]   = 0x71041dddad3595F9CEd3dCCFBe3D1F4b0a16Bb70;
        priceFeeds["BTC"]   = 0xCCADC697c55bbB68dc5bCdf8d3CBe83CdD4E071E;
        priceFeeds["cbBTC"] = 0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D;
    }

    // ─────────────────── External ───────────────────

    /**
     * @notice Create a new prediction tournament.
     * @param asset The asset ticker (ETH, BTC, cbBTC)
     * @param duration Duration in seconds
     * @param entryFee ETH entry fee per participant
     * @param maxParticipants Max number of allowed participants
     */
    function createTournament(
        string calldata asset,
        uint256 duration,
        uint256 entryFee,
        uint256 maxParticipants
    ) external payable returns (uint256 tournamentId) {
        require(priceFeeds[asset] != address(0), "Unsupported asset");
        require(duration >= 3600, "Min 1 hour");
        require(maxParticipants >= 2, "Min 2 participants");

        uint256 startPrice = _getPrice(priceFeeds[asset]);

        tournamentId = ++tournamentCount;
        tournaments[tournamentId] = Tournament({
            creator:          msg.sender,
            asset:            asset,
            priceFeed:        priceFeeds[asset],
            entryFee:         entryFee,
            prizePool:        msg.value,
            startTime:        block.timestamp,
            endTime:          block.timestamp + duration,
            startPrice:       startPrice,
            finalPrice:       0,
            participantCount: 0,
            maxParticipants:  uint32(maxParticipants),
            resolved:         false,
            directionUp:      true
        });

        emit TournamentCreated(tournamentId, msg.sender, asset);
    }

    /**
     * @notice Enter a tournament and pay the entry fee.
     */
    function enterTournament(uint256 tournamentId) external payable nonReentrant {
        Tournament storage t = _getActiveTournament(tournamentId);

        if (predictions[tournamentId][msg.sender].predictor != address(0)) revert AlreadyEntered();
        if (t.participantCount >= t.maxParticipants) revert TournamentFull();
        if (msg.value < t.entryFee) revert InsufficientFee();

        t.prizePool += msg.value;
        t.participantCount++;
        participants[tournamentId].push(msg.sender);

        emit TournamentEntered(tournamentId, msg.sender);
    }

    /**
     * @notice Submit a price prediction (must be called after entering).
     * @param predictedPrice Predicted final price in 8 decimal Chainlink format
     * @param direction true = UP from start price, false = DOWN
     */
    function submitPrediction(
        uint256 tournamentId,
        uint256 predictedPrice,
        bool direction
    ) external {
        Tournament storage t = _getActiveTournament(tournamentId);
        Prediction storage p = predictions[tournamentId][msg.sender];

        if (p.predictor == address(0)) revert NotParticipant();
        p.predictedPrice = predictedPrice;
        p.direction = direction;

        emit PredictionSubmitted(tournamentId, msg.sender, predictedPrice, direction);
    }

    /**
     * @notice Resolve a tournament after its end time using Chainlink oracle.
     */
    function resolveTournament(uint256 tournamentId) external {
        Tournament storage t = tournaments[tournamentId];
        if (t.creator == address(0)) revert TournamentNotFound();
        if (t.resolved) revert TournamentAlreadyResolved();
        if (block.timestamp < t.endTime) revert ResolutionTooEarly();

        uint256 finalPrice = _getPrice(t.priceFeed);
        t.finalPrice = finalPrice;
        t.resolved = true;

        uint256 winnerCount = _countWinners(tournamentId, finalPrice, t.startPrice);
        emit TournamentResolved(tournamentId, finalPrice, winnerCount);

        // Mint NFT trophies to top 3 winners
        _mintTrophies(tournamentId, finalPrice, t.startPrice);
    }

    /**
     * @notice Claim ETH reward after tournament resolution.
     */
    function claimReward(uint256 tournamentId) external nonReentrant {
        Tournament storage t = tournaments[tournamentId];
        if (!t.resolved) revert TournamentNotActive();

        Prediction storage p = predictions[tournamentId][msg.sender];
        if (p.predictor == address(0)) revert NotParticipant();
        if (p.claimed) revert AlreadyClaimed();

        bool won = _isWinner(p, t.finalPrice, t.startPrice);
        if (!won) revert NotWinner();

        p.claimed = true;

        uint256 winnerCount = _countWinners(tournamentId, t.finalPrice, t.startPrice);
        uint256 platformFee = (t.prizePool * PLATFORM_FEE_BPS) / 10000;
        uint256 distributable = t.prizePool - platformFee;
        uint256 reward = distributable / winnerCount;

        (bool ok, ) = msg.sender.call{value: reward}("");
        require(ok, "Transfer failed");

        emit RewardClaimed(tournamentId, msg.sender, reward);
    }

    // ─────────────────── View ───────────────────

    function getTournament(uint256 tournamentId)
        external
        view
        returns (
            address creator,
            string memory asset,
            uint256 entryFee,
            uint256 prizePool,
            uint256 endTime,
            uint256 participantCount,
            uint256 maxParticipants,
            bool resolved
        )
    {
        Tournament storage t = tournaments[tournamentId];
        return (
            t.creator,
            t.asset,
            t.entryFee,
            t.prizePool,
            t.endTime,
            t.participantCount,
            t.maxParticipants,
            t.resolved
        );
    }

    function getTournamentCount() external view returns (uint256) {
        return tournamentCount;
    }

    function getParticipants(uint256 tournamentId) external view returns (address[] memory) {
        return participants[tournamentId];
    }

    // ─────────────────── Admin ───────────────────

    function withdrawFees() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "Withdraw failed");
    }

    function addPriceFeed(string calldata asset, address feed) external onlyOwner {
        priceFeeds[asset] = feed;
    }

    // ─────────────────── Internal ───────────────────

    function _getActiveTournament(uint256 id) internal view returns (Tournament storage t) {
        t = tournaments[id];
        if (t.creator == address(0)) revert TournamentNotFound();
        if (block.timestamp >= t.endTime) revert TournamentNotActive();
        if (t.resolved) revert TournamentAlreadyResolved();
    }

    function _getPrice(address feed) internal view returns (uint256) {
        (, int256 price, , , ) = AggregatorV3Interface(feed).latestRoundData();
        require(price > 0, "Invalid price");
        return uint256(price);
    }

    function _isWinner(
        Prediction storage p,
        uint256 finalPrice,
        uint256 startPrice
    ) internal view returns (bool) {
        if (p.predictor == address(0)) return false;
        bool priceWentUp = finalPrice > startPrice;
        return p.direction == priceWentUp;
    }

    function _countWinners(
        uint256 tournamentId,
        uint256 finalPrice,
        uint256 startPrice
    ) internal view returns (uint256 count) {
        address[] storage parts = participants[tournamentId];
        for (uint256 i = 0; i < parts.length; i++) {
            if (_isWinner(predictions[tournamentId][parts[i]], finalPrice, startPrice)) {
                count++;
            }
        }
    }

    function _mintTrophies(
        uint256 tournamentId,
        uint256 finalPrice,
        uint256 startPrice
    ) internal {
        address[] storage parts = participants[tournamentId];
        uint256 minted = 0;
        for (uint256 i = 0; i < parts.length && minted < 3; i++) {
            if (_isWinner(predictions[tournamentId][parts[i]], finalPrice, startPrice)) {
                nft.mintTrophy(
                    parts[i],
                    tournamentId,
                    minted == 0 ? "Gold Trophy" : minted == 1 ? "Silver Trophy" : "Bronze Trophy"
                );
                minted++;
            }
        }
    }
}
