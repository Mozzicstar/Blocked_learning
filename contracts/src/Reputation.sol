// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CourseDirectory} from "./courseDirectory.sol";
import {CertificateNFT} from "./CertificateNft.sol";

/**
 * @title ReputationSystem
 * @notice Manages user reputation, XP, and achievement badges
 * @dev Gamification layer for the learning platform
 */
contract ReputationSystem is Ownable {
    // ============ State Variables ============

    CourseDirectory public immutable courseDirectory;
    CertificateNFT public immutable certificateNFT;

    struct UserProfile {
        uint256 totalXP;
        uint256 level;
        uint256 coursesCompleted;
        uint256 coursesCreated;
        uint256 totalRatingsGiven;
        uint256 streak; // Days of consecutive activity
        uint256 lastActivityDate;
    }

    struct Badge {
        string name;
        string description;
        string imageUri;
        uint256 requiredXP;
        bool exists;
    }

    // User profiles
    mapping(address => UserProfile) public userProfiles;

    // Badges
    mapping(uint256 => Badge) public badges;
    uint256 public badgeCount;

    // User badges
    mapping(address => mapping(uint256 => bool)) public userHasBadge;
    mapping(address => uint256[]) private userBadges;

    // XP rewards configuration
    uint256 public xpPerCourseComplete = 100;
    uint256 public xpPerCourseCreated = 500;
    uint256 public xpPerRating = 10;
    uint256 public xpPerStreak = 50;

    // Level thresholds (XP needed for each level)
    uint256[] public levelThresholds;

    // ============ Events ============

    event XPEarned(address indexed user, uint256 amount, string reason);

    event LevelUp(address indexed user, uint256 newLevel);

    event BadgeEarned(
        address indexed user,
        uint256 indexed badgeId,
        string badgeName
    );

    event BadgeCreated(
        uint256 indexed badgeId,
        string name,
        uint256 requiredXP
    );

    event StreakUpdated(address indexed user, uint256 newStreak);

    // ============ Errors ============

    error ReputationSystem__BadgeNotFound();
    error ReputationSystem__AlreadyHasBadge();
    error ReputationSystem__InsufficientXP();

    // ============ Constructor ============

    constructor(
        address _courseDirectory,
        address _certificateNFT
    ) Ownable(msg.sender) {
        courseDirectory = CourseDirectory(_courseDirectory);
        certificateNFT = CertificateNFT(_certificateNFT);

        // Initialize level thresholds (exponential growth)
        levelThresholds.push(0); // Level 1: 0 XP
        levelThresholds.push(100); // Level 2: 100 XP
        levelThresholds.push(300); // Level 3: 300 XP
        levelThresholds.push(600); // Level 4: 600 XP
        levelThresholds.push(1000); // Level 5: 1000 XP
        levelThresholds.push(1500); // Level 6: 1500 XP
        levelThresholds.push(2100); // Level 7: 2100 XP
        levelThresholds.push(2800); // Level 8: 2800 XP
        levelThresholds.push(3600); // Level 9: 3600 XP
        levelThresholds.push(4500); // Level 10: 4500 XP
    }

    // ============ External Functions ============

    /**
     * @notice Award XP for completing a course
     * @param user Address of the user
     * @param courseId ID of the course
     */
    function awardCourseCompletionXP(address user, uint256 courseId) external {
        // Verify completion
        require(
            courseDirectory.hasCompleted(courseId, user),
            "Course not completed"
        );

        _awardXP(user, xpPerCourseComplete, "Course Completion");
        userProfiles[user].coursesCompleted++;

        _updateStreak(user);
        _checkAndAwardBadges(user);
    }

    /**
     * @notice Award XP for creating a course
     * @param user Address of the user
     */
    function awardCourseCreationXP(address user) external {
        _awardXP(user, xpPerCourseCreated, "Course Creation");
        userProfiles[user].coursesCreated++;

        _checkAndAwardBadges(user);
    }

    /**
     * @notice Award XP for rating a course
     * @param user Address of the user
     */
    function awardRatingXP(address user) external {
        _awardXP(user, xpPerRating, "Course Rating");
        userProfiles[user].totalRatingsGiven++;
    }

    /**
     * @notice Create a new badge
     * @param name Badge name
     * @param description Badge description
     * @param imageUri IPFS URI for badge image
     * @param requiredXP XP required to earn badge
     */
    function createBadge(
        string calldata name,
        string calldata description,
        string calldata imageUri,
        uint256 requiredXP
    ) external onlyOwner returns (uint256) {
        uint256 badgeId = ++badgeCount;

        badges[badgeId] = Badge({
            name: name,
            description: description,
            imageUri: imageUri,
            requiredXP: requiredXP,
            exists: true
        });

        emit BadgeCreated(badgeId, name, requiredXP);

        return badgeId;
    }

    /**
     * @notice Update XP reward amounts (owner only)
     */
    function updateXPRewards(
        uint256 _courseComplete,
        uint256 _courseCreated,
        uint256 _rating,
        uint256 _streak
    ) external onlyOwner {
        xpPerCourseComplete = _courseComplete;
        xpPerCourseCreated = _courseCreated;
        xpPerRating = _rating;
        xpPerStreak = _streak;
    }

    /**
     * @notice Add new level threshold
     * @param xpRequired XP required for the new level
     */
    function addLevelThreshold(uint256 xpRequired) external onlyOwner {
        levelThresholds.push(xpRequired);
    }

    /**
     * @notice Manually award badge (owner only)
     * @param user Address of the user
     * @param badgeId ID of the badge
     */
    function awardBadgeManually(
        address user,
        uint256 badgeId
    ) external onlyOwner {
        if (!badges[badgeId].exists) {
            revert ReputationSystem__BadgeNotFound();
        }
        if (userHasBadge[user][badgeId]) {
            revert ReputationSystem__AlreadyHasBadge();
        }

        _awardBadge(user, badgeId);
    }

    // ============ Internal Functions ============

    /**
     * @dev Award XP to a user
     */
    function _awardXP(
        address user,
        uint256 amount,
        string memory reason
    ) internal {
        UserProfile storage profile = userProfiles[user];

        uint256 oldLevel = profile.level;
        profile.totalXP += amount;

        // Check for level up
        uint256 newLevel = _calculateLevel(profile.totalXP);
        if (newLevel > oldLevel) {
            profile.level = newLevel;
            emit LevelUp(user, newLevel);
        }

        emit XPEarned(user, amount, reason);
    }

    /**
     * @dev Calculate level from XP
     */
    function _calculateLevel(uint256 xp) internal view returns (uint256) {
        if (xp == 0) return 1;
        for (uint256 i = levelThresholds.length - 1; i > 0; i--) {
            if (xp >= levelThresholds[i]) {
                return i + 1;
            }
        }
        return 1;
    }

    /**
     * @dev Update user's activity streak
     */
    function _updateStreak(address user) internal {
        UserProfile storage profile = userProfiles[user];

        uint256 today = block.timestamp / 1 days;
        uint256 lastActivity = profile.lastActivityDate / 1 days;

        if (today == lastActivity) {
            // Same day, no update
            return;
        } else if (today == lastActivity + 1) {
            // Consecutive day
            profile.streak++;
            _awardXP(user, xpPerStreak, "Streak Bonus");
            emit StreakUpdated(user, profile.streak);
        } else {
            // Streak broken
            profile.streak = 1;
            emit StreakUpdated(user, 1);
        }

        profile.lastActivityDate = block.timestamp;
    }

    /**
     * @dev Check and award eligible badges
     */
    function _checkAndAwardBadges(address user) internal {
        UserProfile memory profile = userProfiles[user];

        for (uint256 i = 1; i <= badgeCount; i++) {
            Badge memory badge = badges[i];

            if (!userHasBadge[user][i] && profile.totalXP >= badge.requiredXP) {
                _awardBadge(user, i);
            }
        }
    }

    /**
     * @dev Award a badge to a user
     */
    function _awardBadge(address user, uint256 badgeId) internal {
        userHasBadge[user][badgeId] = true;
        userBadges[user].push(badgeId);

        emit BadgeEarned(user, badgeId, badges[badgeId].name);
    }

    // ============ View Functions ============

    /**
     * @notice Get user profile
     * @param user Address of the user
     * @return UserProfile struct
     */
    function getUserProfile(
        address user
    ) external view returns (UserProfile memory) {
        return userProfiles[user];
    }

    /**
     * @notice Get all badges earned by user
     * @param user Address of the user
     * @return Array of badge IDs
     */
    function getUserBadges(
        address user
    ) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    /**
     * @notice Get badge details
     * @param badgeId ID of the badge
     * @return Badge struct
     */
    function getBadge(uint256 badgeId) external view returns (Badge memory) {
        return badges[badgeId];
    }

    /**
     * @notice Calculate XP needed for next level
     * @param user Address of the user
     * @return XP needed
     */
    function getXPToNextLevel(address user) external view returns (uint256) {
        UserProfile memory profile = userProfiles[user];

        if (profile.level >= levelThresholds.length) {
            return 0; // Max level reached
        }

        uint256 nextLevelXP = levelThresholds[profile.level];
        return
            nextLevelXP > profile.totalXP ? nextLevelXP - profile.totalXP : 0;
    }

    /**
     * @notice Get leaderboard (top users by XP)
     * @param limit Number of top users to return
     * @return Array of addresses
     */
    function getLeaderboard(
        uint256 limit
    ) external view returns (address[] memory) {
        // Note: This is a simplified version
        // In production, use off-chain indexing for efficient leaderboards
        address[] memory topUsers = new address[](limit);
        // Implementation would require additional tracking
        return topUsers;
    }
}
