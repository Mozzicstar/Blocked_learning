// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {RoyaltyManager} from "../src/royaltyManager.sol";
import {IPRegistry} from "../src/IpRegistry.sol";

/**
 * @title DeployRoyaltyManager
 * @notice Deploys RoyaltyManager contract
 * @dev Run with: forge script script/DeployRoyaltyManager.s.sol:DeployRoyaltyManager --rpc-url <RPC> --broadcast
 */
contract DeployRoyaltyManager is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address ipRegistryAddress = vm.envAddress("IP_REGISTRY_ADDRESS");
        address feeRecipient = vm.envOr(
            "FEE_RECIPIENT",
            vm.addr(deployerPrivateKey)
        );
        uint256 platformFeeBps = vm.envOr("PLATFORM_FEE_BPS", uint256(250)); // Default 2.5%

        console2.log("Deploying RoyaltyManager...");
        console2.log("IP Registry:");
        console2.log(ipRegistryAddress);
        console2.log("Fee Recipient:");
        console2.log(feeRecipient);
        console2.log("Platform Fee:");
        console2.log(platformFeeBps);

        vm.startBroadcast(deployerPrivateKey);

        RoyaltyManager royaltyManager = new RoyaltyManager(
            ipRegistryAddress,
            feeRecipient,
            platformFeeBps
        );

        vm.stopBroadcast();

        console2.log("RoyaltyManager deployed at:");
        console2.log(address(royaltyManager));
        console2.log("\nVerify with:");
        console2.log("forge verify-contract");
        console2.log(address(royaltyManager));
        console2.log("contracts/RoyaltyManager.sol:RoyaltyManager");
    }
}
