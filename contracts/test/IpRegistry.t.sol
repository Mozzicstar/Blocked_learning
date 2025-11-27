// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {IPRegistry} from "../src/IpRegistry.sol";

contract IPRegistryTest is Test {
    IPRegistry public ipRegistry;

    address public owner;
    address public creator1;
    address public creator2;

    // Events
    event CourseRegistered(
        address indexed creator,
        uint256 indexed ipId,
        string metadataHash,
        uint256 timestamp
    );

    event CourseUpdated(
        uint256 indexed courseId,
        string newMetadataHash,
        uint256 timestamp
    );

    event CourseDeactivated(uint256 indexed courseId, uint256 timestamp);

    function setUp() public {
        owner = address(this);
        creator1 = makeAddr("creator1");
        creator2 = makeAddr("creator2");

        ipRegistry = new IPRegistry();
    }

    // ============ Constructor Tests ============

    function testConstructor() public {
        assertEq(ipRegistry.owner(), owner);
        assertEq(ipRegistry.getTotalCourses(), 0);
    }

    // ============ Register Course Tests ============

    function testRegisterCourse() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](2);
        tags[0] = "blockchain";
        tags[1] = "solidity";
        uint256 royaltyBps = 500;

        vm.expectEmit(true, true, false, true);
        emit CourseRegistered(creator1, 1, metadataHash, block.timestamp);

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(
            metadataHash,
            tags,
            royaltyBps
        );

        assertEq(courseId, 1);
        assertEq(ipRegistry.getTotalCourses(), 1);
    }

    function testRegisterCourseIncrementsCourseId() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId1 = ipRegistry.registerCourse("QmTest1", tags, 500);

        vm.prank(creator2);
        uint256 courseId2 = ipRegistry.registerCourse("QmTest2", tags, 500);

        assertEq(courseId1, 1);
        assertEq(courseId2, 2);
        assertEq(ipRegistry.getTotalCourses(), 2);
    }

    function testRegisterCourseStoresCorrectData() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](2);
        tags[0] = "blockchain";
        tags[1] = "solidity";
        uint256 royaltyBps = 500;

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(
            metadataHash,
            tags,
            royaltyBps
        );

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);

        assertEq(course.id, courseId);
        assertEq(course.creator, creator1);
        assertEq(course.metadataHash, metadataHash);
        assertEq(course.timestamp, block.timestamp);
        assertTrue(course.isActive);
        assertEq(course.tags.length, 2);
        assertEq(course.tags[0], "blockchain");
        assertEq(course.tags[1], "solidity");
        assertEq(course.royaltyBps, royaltyBps);
    }

    function testRegisterCourseWithEmptyTags() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](0);
        uint256 royaltyBps = 500;

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(
            metadataHash,
            tags,
            royaltyBps
        );

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);
        assertEq(course.tags.length, 0);
    }

    function testRegisterCourseWithZeroRoyalty() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(metadataHash, tags, 0);

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);
        assertEq(course.royaltyBps, 0);
    }

    function testRegisterCourseWithMaxRoyalty() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(metadataHash, tags, 10000);

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);
        assertEq(course.royaltyBps, 10000);
    }

    function testCannotRegisterCourseWithEmptyMetadata() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        vm.expectRevert(IPRegistry.IPRegistry__InvalidMetadataHash.selector);
        ipRegistry.registerCourse("", tags, 500);
    }

    function testCannotRegisterCourseWithInvalidRoyalty() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        vm.expectRevert(IPRegistry.IPRegistry__InvalidRoyalty.selector);
        ipRegistry.registerCourse("QmTest123", tags, 10001);
    }

    function testCannotRegisterDuplicateMetadataHash() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        ipRegistry.registerCourse(metadataHash, tags, 500);

        vm.prank(creator2);
        vm.expectRevert(IPRegistry.IPRegistry__CourseAlreadyExists.selector);
        ipRegistry.registerCourse(metadataHash, tags, 500);
    }

    // ============ Update Course Metadata Tests ============

    function testUpdateCourseMetadata() public {
        string memory oldHash = "QmTest123";
        string memory newHash = "QmTest456";
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse(oldHash, tags, 500);

        vm.expectEmit(true, false, false, true);
        emit CourseUpdated(courseId, newHash, block.timestamp);

        ipRegistry.updateCourseMetadata(courseId, newHash);
        vm.stopPrank();

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);
        assertEq(course.metadataHash, newHash);
    }

    function testUpdateCourseMetadataUpdatesMapping() public {
        string memory oldHash = "QmTest123";
        string memory newHash = "QmTest456";
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse(oldHash, tags, 500);
        ipRegistry.updateCourseMetadata(courseId, newHash);
        vm.stopPrank();

        // Old hash should no longer map to course
        assertEq(ipRegistry.getCourseByMetadataHash(oldHash), 0);

        // New hash should map to course
        assertEq(ipRegistry.getCourseByMetadataHash(newHash), courseId);
    }

    function testCannotUpdateMetadataIfNotCreator() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        vm.prank(creator2);
        vm.expectRevert(IPRegistry.IPRegistry__NotCourseCreator.selector);
        ipRegistry.updateCourseMetadata(courseId, "QmTest456");
    }

    function testCannotUpdateMetadataOfNonexistentCourse() public {
        vm.prank(creator1);
        vm.expectRevert(IPRegistry.IPRegistry__CourseNotFound.selector);
        ipRegistry.updateCourseMetadata(999, "QmTest123");
    }

    function testCannotUpdateMetadataWithEmptyHash() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        vm.expectRevert(IPRegistry.IPRegistry__InvalidMetadataHash.selector);
        ipRegistry.updateCourseMetadata(courseId, "");
        vm.stopPrank();
    }

    function testCannotUpdateMetadataOfInactiveCourse() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);
        ipRegistry.deactivateCourse(courseId);

        vm.expectRevert(IPRegistry.IPRegistry__CourseInactive.selector);
        ipRegistry.updateCourseMetadata(courseId, "QmTest456");
        vm.stopPrank();
    }

    // ============ Deactivate Course Tests ============

    function testDeactivateCourse() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        vm.expectEmit(true, false, false, true);
        emit CourseDeactivated(courseId, block.timestamp);

        ipRegistry.deactivateCourse(courseId);
        vm.stopPrank();

        assertFalse(ipRegistry.isCourseActive(courseId));
    }

    function testCannotDeactivateCourseIfNotCreator() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        vm.prank(creator2);
        vm.expectRevert(IPRegistry.IPRegistry__NotCourseCreator.selector);
        ipRegistry.deactivateCourse(courseId);
    }

    function testCannotDeactivateNonexistentCourse() public {
        vm.prank(creator1);
        vm.expectRevert(IPRegistry.IPRegistry__CourseNotFound.selector);
        ipRegistry.deactivateCourse(999);
    }

    function testCanDeactivateCourseMultipleTimes() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        ipRegistry.deactivateCourse(courseId);
        ipRegistry.deactivateCourse(courseId); // Should not revert
        vm.stopPrank();

        assertFalse(ipRegistry.isCourseActive(courseId));
    }

    // ============ Get Course Tests ============

    function testGetCourse() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](1);
        tags[0] = "blockchain";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(metadataHash, tags, 500);

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);

        assertEq(course.id, courseId);
        assertEq(course.creator, creator1);
        assertEq(course.metadataHash, metadataHash);
        assertTrue(course.isActive);
    }

    function testCannotGetNonexistentCourse() public {
        vm.expectRevert(IPRegistry.IPRegistry__CourseNotFound.selector);
        ipRegistry.getCourse(999);
    }

    // ============ Get Creator Courses Tests ============

    function testGetCreatorCourses() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        ipRegistry.registerCourse("QmTest1", tags, 500);
        ipRegistry.registerCourse("QmTest2", tags, 500);
        ipRegistry.registerCourse("QmTest3", tags, 500);
        vm.stopPrank();

        uint256[] memory courses = ipRegistry.getCreatorCourses(creator1);

        assertEq(courses.length, 3);
        assertEq(courses[0], 1);
        assertEq(courses[1], 2);
        assertEq(courses[2], 3);
    }

    function testGetCreatorCoursesReturnsEmptyForNewCreator() public {
        uint256[] memory courses = ipRegistry.getCreatorCourses(creator1);
        assertEq(courses.length, 0);
    }

    function testGetCreatorCoursesOnlyReturnsOwnCourses() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        ipRegistry.registerCourse("QmTest1", tags, 500);

        vm.prank(creator2);
        ipRegistry.registerCourse("QmTest2", tags, 500);

        uint256[] memory courses1 = ipRegistry.getCreatorCourses(creator1);
        uint256[] memory courses2 = ipRegistry.getCreatorCourses(creator2);

        assertEq(courses1.length, 1);
        assertEq(courses2.length, 1);
        assertEq(courses1[0], 1);
        assertEq(courses2[0], 2);
    }

    // ============ Get Course By Metadata Hash Tests ============

    function testGetCourseByMetadataHash() public {
        string memory metadataHash = "QmTest123";
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(metadataHash, tags, 500);

        uint256 foundCourseId = ipRegistry.getCourseByMetadataHash(
            metadataHash
        );
        assertEq(foundCourseId, courseId);
    }

    function testGetCourseByMetadataHashReturnsZeroForNonexistent() public {
        uint256 courseId = ipRegistry.getCourseByMetadataHash("QmNonexistent");
        assertEq(courseId, 0);
    }

    // ============ Get Total Courses Tests ============

    function testGetTotalCoursesStartsAtZero() public {
        assertEq(ipRegistry.getTotalCourses(), 0);
    }

    function testGetTotalCoursesIncrementsCorrectly() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        assertEq(ipRegistry.getTotalCourses(), 0);

        vm.prank(creator1);
        ipRegistry.registerCourse("QmTest1", tags, 500);
        assertEq(ipRegistry.getTotalCourses(), 1);

        vm.prank(creator2);
        ipRegistry.registerCourse("QmTest2", tags, 500);
        assertEq(ipRegistry.getTotalCourses(), 2);
    }

    // ============ Is Course Active Tests ============

    function testIsCourseActiveReturnsTrue() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        assertTrue(ipRegistry.isCourseActive(courseId));
    }

    function testIsCourseActiveReturnsFalseAfterDeactivation() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.startPrank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);
        ipRegistry.deactivateCourse(courseId);
        vm.stopPrank();

        assertFalse(ipRegistry.isCourseActive(courseId));
    }

    function testIsCourseActiveReturnsFalseForNonexistent() public {
        assertFalse(ipRegistry.isCourseActive(999));
    }

    // ============ Fuzz Tests ============

    function testFuzzRegisterCourseWithDifferentRoyalties(
        uint256 royaltyBps
    ) public {
        vm.assume(royaltyBps <= 10000);

        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse(
            "QmTest123",
            tags,
            royaltyBps
        );

        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);
        assertEq(course.royaltyBps, royaltyBps);
    }

    function testFuzzRegisterMultipleCourses(uint8 numCourses) public {
        vm.assume(numCourses > 0 && numCourses <= 50);

        string[] memory tags = new string[](1);
        tags[0] = "test";

        for (uint256 i = 0; i < numCourses; i++) {
            vm.prank(creator1);
            ipRegistry.registerCourse(
                string(abi.encodePacked("QmTest", vm.toString(i))),
                tags,
                500
            );
        }

        assertEq(ipRegistry.getTotalCourses(), numCourses);

        uint256[] memory courses = ipRegistry.getCreatorCourses(creator1);
        assertEq(courses.length, numCourses);
    }

    function testFuzzCannotRegisterWithInvalidRoyalty(
        uint256 royaltyBps
    ) public {
        vm.assume(royaltyBps > 10000);

        string[] memory tags = new string[](1);
        tags[0] = "test";

        vm.prank(creator1);
        vm.expectRevert(IPRegistry.IPRegistry__InvalidRoyalty.selector);
        ipRegistry.registerCourse("QmTest123", tags, royaltyBps);
    }

    // ============ Integration Tests ============

    function testCompleteWorkflow() public {
        string[] memory tags = new string[](2);
        tags[0] = "blockchain";
        tags[1] = "solidity";

        // Register course
        vm.prank(creator1);
        uint256 courseId = ipRegistry.registerCourse("QmTest123", tags, 500);

        // Verify registration
        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);
        assertEq(course.creator, creator1);
        assertTrue(course.isActive);

        // Update metadata
        vm.prank(creator1);
        ipRegistry.updateCourseMetadata(courseId, "QmTest456");

        course = ipRegistry.getCourse(courseId);
        assertEq(course.metadataHash, "QmTest456");

        // Deactivate course
        vm.prank(creator1);
        ipRegistry.deactivateCourse(courseId);

        assertFalse(ipRegistry.isCourseActive(courseId));
    }

    function testMultipleCreatorsWorkflow() public {
        string[] memory tags = new string[](1);
        tags[0] = "test";

        // Creator1 registers 2 courses
        vm.startPrank(creator1);
        uint256 course1 = ipRegistry.registerCourse("QmTest1", tags, 500);
        uint256 course2 = ipRegistry.registerCourse("QmTest2", tags, 600);
        vm.stopPrank();

        // Creator2 registers 1 course
        vm.prank(creator2);
        uint256 course3 = ipRegistry.registerCourse("QmTest3", tags, 700);

        // Verify total courses
        assertEq(ipRegistry.getTotalCourses(), 3);

        // Verify creator1's courses
        uint256[] memory creator1Courses = ipRegistry.getCreatorCourses(
            creator1
        );
        assertEq(creator1Courses.length, 2);
        assertEq(creator1Courses[0], course1);
        assertEq(creator1Courses[1], course2);

        // Verify creator2's courses
        uint256[] memory creator2Courses = ipRegistry.getCreatorCourses(
            creator2
        );
        assertEq(creator2Courses.length, 1);
        assertEq(creator2Courses[0], course3);
    }
}
