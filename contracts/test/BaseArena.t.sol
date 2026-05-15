// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {BaseArena} from "../src/BaseArena.sol";
import {ArenaNFT} from "../src/ArenaNFT.sol";

contract BaseArenaTest is Test {
    BaseArena public arena;
    ArenaNFT  public nft;

    address public owner   = address(this);
    address public alice   = makeAddr("alice");
    address public bob     = makeAddr("bob");
    address public charlie = makeAddr("charlie");

    uint256 constant ENTRY_FEE = 0.01 ether;
    uint256 constant DURATION  = 3600; // 1 hour
    uint256 constant MAX_PARTS = 100;

    function setUp() public {
        nft   = new ArenaNFT();
        arena = new BaseArena(address(nft));
        nft.setArena(address(arena));

        vm.deal(alice,   10 ether);
        vm.deal(bob,     10 ether);
        vm.deal(charlie, 10 ether);

        // Mock Chainlink feeds
        vm.mockCall(
            0x71041dddad3595F9CEd3dCCFBe3D1F4b0a16Bb70,
            abi.encodeWithSignature("latestRoundData()"),
            abi.encode(0, int256(3000_00000000), 0, block.timestamp, 0)
        );
    }

    function test_CreateTournament() public {
        vm.prank(alice);
        uint256 id = arena.createTournament{value: 0.5 ether}("ETH", DURATION, ENTRY_FEE, MAX_PARTS);
        assertEq(id, 1);

        (address creator,,uint256 fee, uint256 pool,,,,) = arena.getTournament(1);
        assertEq(creator, alice);
        assertEq(fee, ENTRY_FEE);
        assertEq(pool, 0.5 ether);
    }

    function test_EnterTournament() public {
        vm.prank(alice);
        arena.createTournament{value: 0.5 ether}("ETH", DURATION, ENTRY_FEE, MAX_PARTS);

        vm.prank(bob);
        arena.enterTournament{value: ENTRY_FEE}(1);

        (,,,,, uint256 count,,) = arena.getTournament(1);
        assertEq(count, 1);
    }

    function test_CannotEnterTwice() public {
        vm.prank(alice);
        arena.createTournament{value: 0.5 ether}("ETH", DURATION, ENTRY_FEE, MAX_PARTS);

        vm.startPrank(bob);
        arena.enterTournament{value: ENTRY_FEE}(1);
        vm.expectRevert(BaseArena.AlreadyEntered.selector);
        arena.enterTournament{value: ENTRY_FEE}(1);
        vm.stopPrank();
    }

    function test_ResolutionBeforeEndReverts() public {
        vm.prank(alice);
        arena.createTournament{value: 0.5 ether}("ETH", DURATION, ENTRY_FEE, MAX_PARTS);

        vm.expectRevert(BaseArena.ResolutionTooEarly.selector);
        arena.resolveTournament(1);
    }

    function test_ResolveAndClaim() public {
        vm.prank(alice);
        arena.createTournament{value: 0.5 ether}("ETH", DURATION, ENTRY_FEE, MAX_PARTS);

        vm.prank(bob);
        arena.enterTournament{value: ENTRY_FEE}(1);

        // Bob submits UP prediction
        vm.prank(bob);
        arena.submitPrediction(1, 3500_00000000, true);

        // Warp past end; mock final price higher (ETH went UP)
        vm.warp(block.timestamp + DURATION + 1);
        vm.mockCall(
            0x71041dddad3595F9CEd3dCCFBe3D1F4b0a16Bb70,
            abi.encodeWithSignature("latestRoundData()"),
            abi.encode(0, int256(3500_00000000), 0, block.timestamp, 0)
        );

        arena.resolveTournament(1);

        uint256 bobBefore = bob.balance;
        vm.prank(bob);
        arena.claimReward(1);

        assertGt(bob.balance, bobBefore, "Bob should have received ETH");
    }

    function test_TournamentCount() public {
        assertEq(arena.getTournamentCount(), 0);
        vm.prank(alice);
        arena.createTournament{value: 0.1 ether}("ETH", DURATION, ENTRY_FEE, MAX_PARTS);
        assertEq(arena.getTournamentCount(), 1);
    }
}
