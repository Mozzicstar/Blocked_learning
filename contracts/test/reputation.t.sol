// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {IPRegistry} from "../src/IpRegistry.sol";
import {CourseDirectory} from "../src/courseDirectory.sol";
import {CertificateNFT} from "../src/CertificateNft.sol";
import {ReputationSystem} from "../src/Reputation.sol";

contract ReputationSystemTest is Test {
    IPRegistry public ipRegistry;
    CourseDirectory public courseDirectory;
    CertificateNFT public certificateNFT;
    ReputationSystem public reputationSystem;

    address public creator;
    address public learner;

    event XPEarned(address indexed user, uint256 amount, string reason);
    event LevelUp(address indexed user, uint256 newLevel);
    event BadgeEarned(
        address indexed user,
        uint256 indexed badgeId,
        string badgeName
    );

    function setUp() public {
        creator = makeAddr("creator");
        learner = makeAddr("learner");

        // Deploy contracts
        ipRegistry = new IPRegistry();
        courseDirectory = new CourseDirectory(address(ipRegistry));
        certificateNFT = new CertificateNFT(
            address(courseDirectory),
            address(ipRegistry)
        );
        reputationSystem = new ReputationSystem(
            address(courseDirectory),
            address(certificateNFT)
        );
    }

    function _setupCourse() internal returns (uint256) {
        vm.prank(creator);
        string[] memory tags = new string[](1);
        tags[0] = "blockchain";
        return ipRegistry.registerCourse("QmTest123", tags, 500);
    }

    function _completeCourse(address user, uint256 courseId) internal {
        vm.startPrank(user);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        vm.stopPrank();
    }

    function testAwardCourseCompletionXP() public {
        uint256 courseId = _setupCourse();
        _completeCourse(learner, courseId);

        uint256 expectedXP = reputationSystem.xpPerCourseComplete();

        vm.expectEmit(true, false, false, true);
        emit XPEarned(learner, expectedXP, "Course Completion");

        reputationSystem.awardCourseCompletionXP(learner, courseId);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(learner);
        assertEq(profile.totalXP, expectedXP);
        assertEq(profile.coursesCompleted, 1);
    }

    function testAwardCourseCreationXP() public {
        uint256 expectedXP = reputationSystem.xpPerCourseCreated();

        vm.expectEmit(true, false, false, true);
        emit XPEarned(creator, expectedXP, "Course Creation");

        reputationSystem.awardCourseCreationXP(creator);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(creator);
        assertEq(profile.totalXP, expectedXP);
        assertEq(profile.coursesCreated, 1);
    }

    function testAwardRatingXP() public {
        uint256 expectedXP = reputationSystem.xpPerRating();

        vm.expectEmit(true, false, false, true);
        emit XPEarned(learner, expectedXP, "Course Rating");

        reputationSystem.awardRatingXP(learner);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(learner);
        assertEq(profile.totalXP, expectedXP);
        assertEq(profile.totalRatingsGiven, 1);
    }

    function testLevelUp() public {
        // Award enough XP to reach level 2 (100 XP required)
        uint256 courseId = _setupCourse();
        _completeCourse(learner, courseId);

        vm.expectEmit(true, false, false, true);
        emit LevelUp(learner, 2);

        reputationSystem.awardCourseCompletionXP(learner, courseId);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(learner);
        assertEq(profile.level, 2);
    }

    function testCreateBadge() public {
        uint256 badgeId = reputationSystem.createBadge(
            "Early Adopter",
            "Completed first course",
            "ipfs://QmBadge1",
            50
        );

        assertEq(badgeId, 1);

        ReputationSystem.Badge memory badge = reputationSystem.getBadge(1);
        assertEq(badge.name, "Early Adopter");
        assertEq(badge.requiredXP, 50);
        assertTrue(badge.exists);
    }

    function testAutomaticBadgeAward() public {
        // Create badge
        reputationSystem.createBadge(
            "First Course",
            "Complete first course",
            "ipfs://QmBadge1",
            100
        );

        // Earn enough XP for badge
        uint256 courseId = _setupCourse();
        _completeCourse(learner, courseId);

        vm.expectEmit(true, true, false, true);
        emit BadgeEarned(learner, 1, "First Course");

        reputationSystem.awardCourseCompletionXP(learner, courseId);

        assertTrue(reputationSystem.userHasBadge(learner, 1));

        uint256[] memory badges = reputationSystem.getUserBadges(learner);
        assertEq(badges.length, 1);
        assertEq(badges[0], 1);
    }

    function testManualBadgeAward() public {
        // Create badge
        reputationSystem.createBadge(
            "Special Achievement",
            "Awarded manually",
            "ipfs://QmBadge1",
            1000
        );

        vm.expectEmit(true, true, false, true);
        emit BadgeEarned(learner, 1, "Special Achievement");

        reputationSystem.awardBadgeManually(learner, 1);

        assertTrue(reputationSystem.userHasBadge(learner, 1));
    }

    function testCannotAwardBadgeTwice() public {
        reputationSystem.createBadge(
            "Badge",
            "Description",
            "ipfs://QmBadge1",
            50
        );

        reputationSystem.awardBadgeManually(learner, 1);

        vm.expectRevert(
            ReputationSystem.ReputationSystem__AlreadyHasBadge.selector
        );
        reputationSystem.awardBadgeManually(learner, 1);
    }

    function testUpdateXPRewards() public {
        reputationSystem.updateXPRewards(200, 1000, 20, 100);

        assertEq(reputationSystem.xpPerCourseComplete(), 200);
        assertEq(reputationSystem.xpPerCourseCreated(), 1000);
        assertEq(reputationSystem.xpPerRating(), 20);
        assertEq(reputationSystem.xpPerStreak(), 100);
    }

    // function testGetXPToNextLevel() public {
    //     // Start at level 1 (0 XP)
    //     uint256 xpToNext = reputationSystem.getXPToNextLevel(learner);
    //     assertEq(xpToNext, 100); // Need 100 XP for level 2

    //     // Award 50 XP
    //     reputationSystem.awardRatingXP(learner);
    //     reputationSystem.awardRatingXP(learner);
    //     reputationSystem.awardRatingXP(learner);
    //     reputationSystem.awardRatingXP(learner);
    //     reputationSystem.awardRatingXP(learner);

    //     xpToNext = reputationSystem.getXPToNextLevel(learner);
    //     assertEq(xpToNext, 50); // Need 50 more XP
    // }

    function testStreak() public {
        uint256 courseId1 = _setupCourse();
        _completeCourse(learner, courseId1);

        // Day 1: Complete course
        vm.warp(1 days);
        reputationSystem.awardCourseCompletionXP(learner, courseId1);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(learner);
        assertEq(profile.streak, 1);

        // Day 2: Complete another course (consecutive)
        vm.prank(creator);
        uint256 courseId2 = ipRegistry.registerCourse(
            "QmTest456",
            new string[](0),
            500
        );
        _completeCourse(learner, courseId2);

        vm.warp(2 days);

        reputationSystem.awardCourseCompletionXP(learner, courseId2);

        profile = reputationSystem.getUserProfile(learner);
        assertEq(profile.streak, 2);
    }

    function testStreakBreaks() public {
        uint256 courseId1 = _setupCourse();
        _completeCourse(learner, courseId1);

        // Day 1
        vm.warp(1 days);
        reputationSystem.awardCourseCompletionXP(learner, courseId1);

        // Day 5 (skip days - break streak)
        vm.prank(creator);
        uint256 courseId2 = ipRegistry.registerCourse(
            "QmTest456",
            new string[](0),
            500
        );
        _completeCourse(learner, courseId2);

        vm.warp(5 days);
        reputationSystem.awardCourseCompletionXP(learner, courseId2);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(learner);
        assertEq(profile.streak, 1); // Streak reset to 1
    }

    function testMultipleLevelUps() public {
        // Award 1000 XP (should reach level 5)
        for (uint256 i = 0; i < 10; i++) {
            reputationSystem.awardCourseCreationXP(creator); // 500 XP each
        }

        // Award 500 more XP
        reputationSystem.awardCourseCreationXP(creator);

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(creator);
        assertEq(profile.totalXP, 5500);
        assertTrue(profile.level >= 5);
    }

    function testFuzzXPAward(uint256 numCompletions) public {
        vm.assume(numCompletions > 0 && numCompletions < 50);

        uint256 xpPerCompletion = reputationSystem.xpPerCourseComplete();

        for (uint256 i = 0; i < numCompletions; i++) {
            vm.prank(creator);
            uint256 courseId = ipRegistry.registerCourse(
                string(abi.encodePacked("Qm", vm.toString(i))),
                new string[](0),
                500
            );
            _completeCourse(learner, courseId);
            reputationSystem.awardCourseCompletionXP(learner, courseId);
        }

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(learner);

        // Account for streak bonuses
        uint256 minExpectedXP = numCompletions * xpPerCompletion;
        assertGe(profile.totalXP, minExpectedXP);
        assertEq(profile.coursesCompleted, numCompletions);
    }

    function testAddLevelThreshold() public {
        reputationSystem.addLevelThreshold(10000);

        // Award enough XP to reach new level
        for (uint256 i = 0; i < 20; i++) {
            reputationSystem.awardCourseCreationXP(creator); // 500 XP each = 10000 total
        }

        ReputationSystem.UserProfile memory profile = reputationSystem
            .getUserProfile(creator);
        assertTrue(profile.totalXP >= 10000);
    }
}
