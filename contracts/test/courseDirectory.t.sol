// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {IPRegistry} from "../src/IpRegistry.sol";
import {CourseDirectory} from "../src/courseDirectory.sol";

contract CourseDirectoryTest is Test {
    IPRegistry public ipRegistry;
    CourseDirectory public courseDirectory;

    address public creator;
    address public learner1;
    address public learner2;

    uint256 public courseId;

    event CourseEnrolled(
        uint256 indexed courseId,
        address indexed learner,
        uint256 timestamp
    );
    event CourseCompleted(
        uint256 indexed courseId,
        address indexed learner,
        uint256 timestamp
    );
    event CourseRated(
        uint256 indexed courseId,
        address indexed learner,
        uint256 rating
    );
    event CourseViewed(uint256 indexed courseId, address indexed viewer);

    function setUp() public {
        creator = makeAddr("creator");
        learner1 = makeAddr("learner1");
        learner2 = makeAddr("learner2");

        // Deploy contracts
        ipRegistry = new IPRegistry();
        courseDirectory = new CourseDirectory(address(ipRegistry));

        // Register a course
        vm.prank(creator);
        string[] memory tags = new string[](2);
        tags[0] = "blockchain";
        tags[1] = "solidity";
        courseId = ipRegistry.registerCourse("QmTest123", tags, 500);
    }

    function testEnrollCourse() public {
        vm.expectEmit(true, true, false, true);
        emit CourseEnrolled(courseId, learner1, block.timestamp);

        vm.prank(learner1);
        courseDirectory.enrollCourse(courseId);

        assertTrue(courseDirectory.isEnrolled(courseId, learner1));

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);
        assertEq(stats.enrollments, 1);
    }

    function testCannotEnrollTwice() public {
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);

        vm.expectRevert(
            CourseDirectory.CourseDirectory__AlreadyEnrolled.selector
        );
        courseDirectory.enrollCourse(courseId);
        vm.stopPrank();
    }

    function testCannotEnrollInInactiveCourse() public {
        // Deactivate course
        vm.prank(creator);
        ipRegistry.deactivateCourse(courseId);

        // Try to enroll
        vm.prank(learner1);
        vm.expectRevert(
            CourseDirectory.CourseDirectory__CourseNotActive.selector
        );
        courseDirectory.enrollCourse(courseId);
    }

    function testCompleteCourse() public {
        // Enroll first
        vm.prank(learner1);
        courseDirectory.enrollCourse(courseId);

        // Complete
        vm.expectEmit(true, true, false, true);
        emit CourseCompleted(courseId, learner1, block.timestamp);

        vm.prank(learner1);
        courseDirectory.completeCourse(courseId);

        assertTrue(courseDirectory.hasCompleted(courseId, learner1));

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);
        assertEq(stats.completions, 1);
    }

    function testCannotCompleteWithoutEnrolling() public {
        vm.prank(learner1);
        vm.expectRevert(CourseDirectory.CourseDirectory__NotEnrolled.selector);
        courseDirectory.completeCourse(courseId);
    }

    function testCannotCompleteTwice() public {
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);

        vm.expectRevert(
            CourseDirectory.CourseDirectory__AlreadyCompleted.selector
        );
        courseDirectory.completeCourse(courseId);
        vm.stopPrank();
    }

    function testRateCourse() public {
        // Enroll and complete
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);

        // Rate
        vm.expectEmit(true, true, false, true);
        emit CourseRated(courseId, learner1, 5);

        courseDirectory.rateCourse(courseId, 5);
        vm.stopPrank();

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);
        assertEq(stats.totalRating, 5);
        assertEq(stats.ratingCount, 1);
    }

    function testCannotRateWithoutCompletion() public {
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);

        vm.expectRevert(CourseDirectory.CourseDirectory__NotEnrolled.selector);
        courseDirectory.rateCourse(courseId, 5);
        vm.stopPrank();
    }

    function testInvalidRatingTooLow() public {
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);

        vm.expectRevert(
            CourseDirectory.CourseDirectory__InvalidRating.selector
        );
        courseDirectory.rateCourse(courseId, 0);
        vm.stopPrank();
    }

    function testInvalidRatingTooHigh() public {
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);

        vm.expectRevert(
            CourseDirectory.CourseDirectory__InvalidRating.selector
        );
        courseDirectory.rateCourse(courseId, 6);
        vm.stopPrank();
    }

    function testAverageRating() public {
        // Learner1 rates 5
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        courseDirectory.rateCourse(courseId, 5);
        vm.stopPrank();

        // Learner2 rates 3
        vm.startPrank(learner2);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        courseDirectory.rateCourse(courseId, 3);
        vm.stopPrank();

        // Average should be 4.0 (scaled to 400)
        uint256 avgRating = courseDirectory.getAverageRating(courseId);
        assertEq(avgRating, 400); // (5 + 3) / 2 * 100 = 400
    }

    function testAverageRatingWithNoRatings() public {
        uint256 avgRating = courseDirectory.getAverageRating(courseId);
        assertEq(avgRating, 0);
    }

    function testViewCourse() public {
        vm.expectEmit(true, true, false, false);
        emit CourseViewed(courseId, learner1);

        vm.prank(learner1);
        courseDirectory.viewCourse(courseId);

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);
        assertEq(stats.views, 1);
    }

    function testCompletionRate() public {
        // 2 enrollments
        vm.prank(learner1);
        courseDirectory.enrollCourse(courseId);

        vm.prank(learner2);
        courseDirectory.enrollCourse(courseId);

        // 1 completion
        vm.prank(learner1);
        courseDirectory.completeCourse(courseId);

        // Completion rate should be 50% (5000 in basis points)
        uint256 completionRate = courseDirectory.getCompletionRate(courseId);
        assertEq(completionRate, 5000);
    }

    function testCompletionRateWithNoEnrollments() public {
        uint256 completionRate = courseDirectory.getCompletionRate(courseId);
        assertEq(completionRate, 0);
    }

    function testGetCourseStats() public {
        // Enroll 2 learners
        vm.prank(learner1);
        courseDirectory.enrollCourse(courseId);

        vm.prank(learner2);
        courseDirectory.enrollCourse(courseId);

        // 1 completes and rates
        vm.startPrank(learner1);
        courseDirectory.completeCourse(courseId);
        courseDirectory.rateCourse(courseId, 5);
        vm.stopPrank();

        // View
        vm.prank(learner1);
        courseDirectory.viewCourse(courseId);

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);

        assertEq(stats.enrollments, 2);
        assertEq(stats.completions, 1);
        assertEq(stats.totalRating, 5);
        assertEq(stats.ratingCount, 1);
        assertEq(stats.views, 1);
    }

    function testMultipleRatings() public {
        // Learner1: 5 stars
        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        courseDirectory.rateCourse(courseId, 5);
        vm.stopPrank();

        // Learner2: 4 stars
        vm.startPrank(learner2);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        courseDirectory.rateCourse(courseId, 4);
        vm.stopPrank();

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);
        assertEq(stats.totalRating, 9); // 5 + 4
        assertEq(stats.ratingCount, 2);

        uint256 avgRating = courseDirectory.getAverageRating(courseId);
        assertEq(avgRating, 450); // 4.5 * 100
    }

    function testFuzzEnrollments(uint8 numLearners) public {
        vm.assume(numLearners > 0 && numLearners <= 50);

        for (uint256 i = 0; i < numLearners; i++) {
            address learner = makeAddr(
                string(abi.encodePacked("learner", vm.toString(i)))
            );
            vm.prank(learner);
            courseDirectory.enrollCourse(courseId);
        }

        CourseDirectory.CourseStats memory stats = courseDirectory
            .getCourseStats(courseId);
        assertEq(stats.enrollments, numLearners);
    }

    function testFuzzRatings(uint8 rating) public {
        vm.assume(rating >= 1 && rating <= 5);

        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        courseDirectory.rateCourse(courseId, rating);
        vm.stopPrank();

        uint256 avgRating = courseDirectory.getAverageRating(courseId);
        assertEq(avgRating, uint256(rating) * 100);
    }

    function testIsEnrolled() public {
        assertFalse(courseDirectory.isEnrolled(courseId, learner1));

        vm.prank(learner1);
        courseDirectory.enrollCourse(courseId);

        assertTrue(courseDirectory.isEnrolled(courseId, learner1));
    }

    function testHasCompleted() public {
        assertFalse(courseDirectory.hasCompleted(courseId, learner1));

        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        vm.stopPrank();

        assertTrue(courseDirectory.hasCompleted(courseId, learner1));
    }
}
