// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ArenaNFT} from "../src/ArenaNFT.sol";
import {BaseArena} from "../src/BaseArena.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console.log("Deploying from:", deployer);
        console.log("Balance:", deployer.balance);

        vm.startBroadcast(deployerKey);

        // 1. Deploy NFT contract
        ArenaNFT nft = new ArenaNFT();
        console.log("ArenaNFT deployed:", address(nft));

        // 2. Deploy main Arena contract
        BaseArena arena = new BaseArena(address(nft));
        console.log("BaseArena deployed:", address(arena));

        // 3. Wire NFT → Arena
        nft.setArena(address(arena));
        console.log("Arena set on NFT");

        vm.stopBroadcast();

        console.log("\n=== Deployment Complete ===");
        console.log("ArenaNFT:  ", address(nft));
        console.log("BaseArena: ", address(arena));
        console.log("Update .env with these addresses.");
    }
}
