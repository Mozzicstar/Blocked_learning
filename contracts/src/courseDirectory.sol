// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPRegistry} from "./IpRegistry.sol";

/**
 * @title CourseDirectory
 * @notice Read-optimized directory for efficient course queries
 * @dev Works alongside IPRegistry for marketplace functionality
 */
contract CourseDirectory {
    // ============ State Variables ============

    IPRegistry public immutable ipRegistry;

    struct CourseStats {
        uint256 enrollments;
        uint256 completions;
        uint256 totalRating;
        uint256 ratingCount;
        uint256 views;
    }

    // Course stats
    mapping(uint256 => CourseStats) private _courseStats;

    // Tag to course IDs
    mapping(string => uint256[]) private _tagToCourseIds;

    // Enrollment tracking
    mapping(uint256 => mapping(address => bool)) private _enrollments;
    mapping(uint256 => mapping(address => bool)) private _completions;

    // ============ Events ============

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

    // ============ Errors ============

    error CourseDirectory__AlreadyEnrolled();
    error CourseDirectory__NotEnrolled();
    error CourseDirectory__AlreadyCompleted();
    error CourseDirectory__InvalidRating();
    error CourseDirectory__CourseNotActive();

    // ============ Constructor ============

    constructor(address _ipRegistry) {
        ipRegistry = IPRegistry(_ipRegistry);
    }

    // ============ External Functions ============

    /**
     * @notice Enroll in a course
     * @param courseId ID of the course
     */
    function enrollCourse(uint256 courseId) external {
        if (_enrollments[courseId][msg.sender]) {
            revert CourseDirectory__AlreadyEnrolled();
        }

        // Verify course exists and is active
        if (!ipRegistry.isCourseActive(courseId)) {
            revert CourseDirectory__CourseNotActive();
        }

        _enrollments[courseId][msg.sender] = true;
        _courseStats[courseId].enrollments++;

        emit CourseEnrolled(courseId, msg.sender, block.timestamp);
    }

    /**
     * @notice Mark course as completed
     * @param courseId ID of the course
     */
    function completeCourse(uint256 courseId) external {
        if (!_enrollments[courseId][msg.sender]) {
            revert CourseDirectory__NotEnrolled();
        }
        if (_completions[courseId][msg.sender]) {
            revert CourseDirectory__AlreadyCompleted();
        }

        _completions[courseId][msg.sender] = true;
        _courseStats[courseId].completions++;

        emit CourseCompleted(courseId, msg.sender, block.timestamp);
    }

    /**
     * @notice Rate a course (1-5 stars)
     * @param courseId ID of the course
     * @param rating Rating value (1-5)
     */
    function rateCourse(uint256 courseId, uint256 rating) external {
        if (!_completions[courseId][msg.sender]) {
            revert CourseDirectory__NotEnrolled();
        }
        if (rating < 1 || rating > 5) {
            revert CourseDirectory__InvalidRating();
        }

        CourseStats storage stats = _courseStats[courseId];
        stats.totalRating += rating;
        stats.ratingCount++;

        emit CourseRated(courseId, msg.sender, rating);
    }

    /**
     * @notice Increment view count
     * @param courseId ID of the course
     */
    function viewCourse(uint256 courseId) external {
        _courseStats[courseId].views++;
        emit CourseViewed(courseId, msg.sender);
    }

    // ============ View Functions ============

    /**
     * @notice Get course statistics
     * @param courseId ID of the course
     * @return CourseStats struct
     */
    function getCourseStats(
        uint256 courseId
    ) external view returns (CourseStats memory) {
        return _courseStats[courseId];
    }

    /**
     * @notice Get average rating for a course
     * @param courseId ID of the course
     * @return Average rating (scaled by 100, e.g., 450 = 4.5 stars)
     */
    function getAverageRating(
        uint256 courseId
    ) external view returns (uint256) {
        CourseStats memory stats = _courseStats[courseId];
        if (stats.ratingCount == 0) return 0;
        return (stats.totalRating * 100) / stats.ratingCount;
    }

    /**
     * @notice Check if user is enrolled
     * @param courseId ID of the course
     * @param learner Address of the learner
     * @return Boolean
     */
    function isEnrolled(
        uint256 courseId,
        address learner
    ) external view returns (bool) {
        return _enrollments[courseId][learner];
    }

    /**
     * @notice Check if user completed course
     * @param courseId ID of the course
     * @param learner Address of the learner
     * @return Boolean
     */
    function hasCompleted(
        uint256 courseId,
        address learner
    ) external view returns (bool) {
        return _completions[courseId][learner];
    }

    /**
     * @notice Get completion rate
     * @param courseId ID of the course
     * @return Completion rate (scaled by 100, e.g., 7500 = 75%)
     */
    function getCompletionRate(
        uint256 courseId
    ) external view returns (uint256) {
        CourseStats memory stats = _courseStats[courseId];
        if (stats.enrollments == 0) return 0;
        return (stats.completions * 10000) / stats.enrollments;
    }

    /**
     * @notice Get courses by tag
     * @param tag Course tag
     * @return Array of course IDs
     */
    function getCoursesByTag(
        string calldata tag
    ) external view returns (uint256[] memory) {
        return _tagToCourseIds[tag];
    }
}
