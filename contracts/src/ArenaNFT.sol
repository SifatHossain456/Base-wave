// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title ArenaNFT
 * @notice On-chain SVG trophy NFTs minted to Base Arena winners.
 *         Metadata is fully on-chain — no IPFS dependency.
 */
contract ArenaNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct Trophy {
        uint256 tournamentId;
        string  name;
        uint256 mintedAt;
    }

    uint256 public tokenCount;
    address public arena;

    mapping(uint256 => Trophy) public trophies;

    event TrophyMinted(address indexed winner, uint256 indexed tokenId, uint256 indexed tournamentId, string name);

    error NotArena();
    error AlreadySet();

    modifier onlyArena() {
        if (msg.sender != arena) revert NotArena();
        _;
    }

    constructor() ERC721("Base Arena Trophy", "ARENA") Ownable(msg.sender) {}

    function setArena(address _arena) external onlyOwner {
        if (arena != address(0)) revert AlreadySet();
        arena = _arena;
    }

    function mintTrophy(
        address winner,
        uint256 tournamentId,
        string calldata name
    ) external onlyArena returns (uint256 tokenId) {
        tokenId = ++tokenCount;
        trophies[tokenId] = Trophy({
            tournamentId: tournamentId,
            name: name,
            mintedAt: block.timestamp
        });
        _safeMint(winner, tokenId);
        emit TrophyMinted(winner, tokenId, tournamentId, name);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        Trophy memory t = trophies[tokenId];

        string memory color = _trophyColor(t.name);
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            '<defs>',
            '<radialGradient id="bg" cx="50%" cy="50%" r="70%">',
            '<stop offset="0%" stop-color="#0D1F38"/>',
            '<stop offset="100%" stop-color="#050B18"/>',
            '</radialGradient>',
            '<linearGradient id="trophy" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="', color, '"/>',
            '<stop offset="100%" stop-color="', _trophyColor2(t.name), '"/>',
            '</linearGradient>',
            '</defs>',
            '<rect width="400" height="400" fill="url(#bg)" rx="24"/>',
            '<circle cx="200" cy="200" r="120" fill="none" stroke="url(#trophy)" stroke-width="2" opacity="0.4"/>',
            '<text x="200" y="155" text-anchor="middle" font-size="80" fill="url(#trophy)">&#127942;</text>',
            '<text x="200" y="240" text-anchor="middle" font-family="monospace" font-size="20" font-weight="bold" fill="white">',
            t.name,
            '</text>',
            '<text x="200" y="268" text-anchor="middle" font-family="monospace" font-size="13" fill="#94A3B8">',
            'Arena #', t.tournamentId.toString(),
            '</text>',
            '<text x="200" y="340" text-anchor="middle" font-family="monospace" font-size="11" fill="#0052FF">BASE ARENA</text>',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name":"', t.name, ' — Arena #', t.tournamentId.toString(), '",',
            '"description":"On-chain trophy earned in Base Arena prediction tournament.",',
            '"attributes":[',
            '{"trait_type":"Tournament","value":', t.tournamentId.toString(), '},',
            '{"trait_type":"Rarity","value":"', _rarity(t.name), '"},',
            '{"trait_type":"Chain","value":"Base Mainnet"}',
            '],',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function _trophyColor(string memory name) internal pure returns (string memory) {
        bytes32 h = keccak256(bytes(name));
        if (h == keccak256("Gold Trophy"))   return "#F59E0B";
        if (h == keccak256("Silver Trophy")) return "#94A3B8";
        return "#C2772C";
    }

    function _trophyColor2(string memory name) internal pure returns (string memory) {
        bytes32 h = keccak256(bytes(name));
        if (h == keccak256("Gold Trophy"))   return "#FBBF24";
        if (h == keccak256("Silver Trophy")) return "#CBD5E1";
        return "#D97706";
    }

    function _rarity(string memory name) internal pure returns (string memory) {
        bytes32 h = keccak256(bytes(name));
        if (h == keccak256("Gold Trophy"))   return "Gold";
        if (h == keccak256("Silver Trophy")) return "Silver";
        return "Bronze";
    }
}
