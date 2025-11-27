// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console2} from "forge-std/console2.sol";
import {Script} from "forge-std/Script.sol";
import {ReputationSystem} from "../src/Reputation.sol";

/**
 * @title DeployReputationSystem
 * @notice Deploys ReputationSystem contract
 * @dev Run with: forge script script/DeployReputationSystem.s.sol:DeployReputationSystem --rpc-url <RPC> --broadcast
 */
contract DeployReputationSystem is Script {
    function run() external {
        // Load environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address courseDirectoryAddress = vm.envAddress(
            "COURSE_DIRECTORY_ADDRESS"
        );
        address certificateNFTAddress = vm.envAddress(
            "CERTIFICATE_NFT_ADDRESS"
        );

        console2.log("Deploying ReputationSystem...");
        console2.log("Course Directory:");
        console2.log(courseDirectoryAddress);
        console2.log("Certificate NFT:");
        console2.log(certificateNFTAddress);

        vm.startBroadcast(deployerPrivateKey);

        ReputationSystem reputationSystem = new ReputationSystem(
            courseDirectoryAddress,
            certificateNFTAddress
        );

        vm.stopBroadcast();

        console2.log("ReputationSystem deployed at:");
        console2.log(address(reputationSystem));

        // Create initial badges
        console2.log("\nCreating initial badges...");

        vm.startBroadcast(deployerPrivateKey);

        reputationSystem.createBadge(
            "Early Adopter",
            "Completed first course on BLOCKEDLEARNING",
            "ipfs://QmBadge1",
            100
        );

        reputationSystem.createBadge(
            "Dedicated Learner",
            "Completed 5 courses",
            "ipfs://QmBadge2",
            500
        );

        reputationSystem.createBadge(
            "Master",
            "Completed 10 courses",
            "ipfs://QmBadge3",
            1000
        );

        reputationSystem.createBadge(
            "Content Creator",
            "Created first course",
            "ipfs://QmBadge4",
            500
        );

        vm.stopBroadcast();

        console2.log("Initial badges created!");
        console2.log("\nVerify with:");
        console2.log("forge verify-contract");
        console2.log((address(reputationSystem)));
        console2.log("contracts/Reputation.sol:ReputationSystem");
        console2.log("--constructor-args");
    }
}
