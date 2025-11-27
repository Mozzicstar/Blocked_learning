// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPRegistry
 * @notice Core contract for registering course IP on BLOCKEDLEARNING platform
 * @dev Integrates with Camp Origin SDK for IP token generation
 */
contract IPRegistry is Ownable, ReentrancyGuard {
    // ============ State Variables ============

    struct Course {
        uint256 id;
        address creator;
        string metadataHash; // IPFS hash containing course details
        uint256 timestamp;
        bool isActive;
        string[] tags;
        uint256 royaltyBps; // Royalty in basis points (100 = 1%)
    }

    // Course ID counter
    uint256 private _courseIdCounter;

    // Mapping from course ID to Course
    mapping(uint256 => Course) private _courses;

    // Mapping from creator address to their course IDs
    mapping(address => uint256[]) private _creatorCourses;

    // Mapping from metadata hash to course ID (prevent duplicates)
    mapping(string => uint256) private _metadataHashToCourseId;

    // ============ Events ============

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

    // ============ Errors ============

    error IPRegistry__CourseNotFound();
    error IPRegistry__NotCourseCreator();
    error IPRegistry__CourseAlreadyExists();
    error IPRegistry__CourseInactive();
    error IPRegistry__InvalidMetadataHash();
    error IPRegistry__InvalidRoyalty();

    // ============ Constructor ============

    constructor() Ownable(msg.sender) {
        _courseIdCounter = 1; // Start from 1
    }

    // ============ External Functions ============

    /**
     * @notice Register a new course IP
     * @param metadataHash IPFS hash containing course metadata
     * @param tags Array of course tags
     * @param royaltyBps Royalty percentage in basis points (e.g., 500 = 5%)
     * @return courseId The newly created course ID
     */
    function registerCourse(
        string calldata metadataHash,
        string[] calldata tags,
        uint256 royaltyBps
    ) external nonReentrant returns (uint256) {
        // Validate inputs
        if (bytes(metadataHash).length == 0) {
            revert IPRegistry__InvalidMetadataHash();
        }
        if (royaltyBps > 10000) {
            // Max 100%
            revert IPRegistry__InvalidRoyalty();
        }
        if (_metadataHashToCourseId[metadataHash] != 0) {
            revert IPRegistry__CourseAlreadyExists();
        }

        uint256 courseId = _courseIdCounter++;

        // Create course
        _courses[courseId] = Course({
            id: courseId,
            creator: msg.sender,
            metadataHash: metadataHash,
            timestamp: block.timestamp,
            isActive: true,
            tags: tags,
            royaltyBps: royaltyBps
        });

        // Update mappings
        _creatorCourses[msg.sender].push(courseId);
        _metadataHashToCourseId[metadataHash] = courseId;

        emit CourseRegistered(
            msg.sender,
            courseId,
            metadataHash,
            block.timestamp
        );

        return courseId;
    }

    /**
     * @notice Update course metadata (creator only)
     * @param courseId ID of the course to update
     * @param newMetadataHash New IPFS hash
     */
    function updateCourseMetadata(
        uint256 courseId,
        string calldata newMetadataHash
    ) external {
        Course storage course = _courses[courseId];

        if (course.creator == address(0)) {
            revert IPRegistry__CourseNotFound();
        }
        if (course.creator != msg.sender) {
            revert IPRegistry__NotCourseCreator();
        }
        if (!course.isActive) {
            revert IPRegistry__CourseInactive();
        }
        if (bytes(newMetadataHash).length == 0) {
            revert IPRegistry__InvalidMetadataHash();
        }

        // Remove old hash mapping
        delete _metadataHashToCourseId[course.metadataHash];

        // Update to new hash
        course.metadataHash = newMetadataHash;
        _metadataHashToCourseId[newMetadataHash] = courseId;

        emit CourseUpdated(courseId, newMetadataHash, block.timestamp);
    }

    /**
     * @notice Deactivate a course (creator only)
     * @param courseId ID of the course to deactivate
     */
    function deactivateCourse(uint256 courseId) external {
        Course storage course = _courses[courseId];

        if (course.creator == address(0)) {
            revert IPRegistry__CourseNotFound();
        }
        if (course.creator != msg.sender) {
            revert IPRegistry__NotCourseCreator();
        }

        course.isActive = false;

        emit CourseDeactivated(courseId, block.timestamp);
    }

    // ============ View Functions ============

    /**
     * @notice Get course details
     * @param courseId ID of the course
     * @return Course struct
     */
    function getCourse(uint256 courseId) external view returns (Course memory) {
        Course memory course = _courses[courseId];
        if (course.creator == address(0)) {
            revert IPRegistry__CourseNotFound();
        }
        return course;
    }

    /**
     * @notice Get all courses by a creator
     * @param creator Address of the creator
     * @return Array of course IDs
     */
    function getCreatorCourses(
        address creator
    ) external view returns (uint256[] memory) {
        return _creatorCourses[creator];
    }

    /**
     * @notice Get course ID by metadata hash
     * @param metadataHash IPFS hash
     * @return courseId
     */
    function getCourseByMetadataHash(
        string calldata metadataHash
    ) external view returns (uint256) {
        return _metadataHashToCourseId[metadataHash];
    }

    /**
     * @notice Get total number of courses
     * @return Total courses registered
     */
    function getTotalCourses() external view returns (uint256) {
        return _courseIdCounter - 1;
    }

    /**
     * @notice Check if a course is active
     * @param courseId ID of the course
     * @return Boolean indicating if course is active
     */
    function isCourseActive(uint256 courseId) external view returns (bool) {
        return _courses[courseId].isActive;
    }
}
