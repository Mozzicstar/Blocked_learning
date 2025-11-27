// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IPRegistry} from "./IpRegistry.sol";

/**
 * @title RoyaltyManager
 * @notice Manages revenue distribution for course purchases
 * @dev Handles creator royalties and platform fees
 */
contract RoyaltyManager is Ownable, ReentrancyGuard {
    // ============ State Variables ============

    IPRegistry public immutable ipRegistry;

    // Platform fee in basis points (100 = 1%)
    uint256 public platformFeeBps;

    // Platform fee recipient
    address public feeRecipient;

    // Course price in wei
    mapping(uint256 => uint256) public coursePrice;

    // Total revenue per course
    mapping(uint256 => uint256) public courseRevenue;

    // Pending withdrawals for creators
    mapping(address => uint256) public pendingWithdrawals;

    // Platform earnings
    uint256 public platformEarnings;

    // Purchase tracking
    mapping(uint256 => mapping(address => bool)) public hasPurchased;

    // ============ Events ============

    event CoursePurchased(
        uint256 indexed courseId,
        address indexed buyer,
        uint256 amount,
        uint256 creatorAmount,
        uint256 platformFee
    );

    event PriceUpdated(
        uint256 indexed courseId,
        uint256 oldPrice,
        uint256 newPrice
    );

    event WithdrawalMade(address indexed creator, uint256 amount);

    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    event FeeRecipientUpdated(address oldRecipient, address newRecipient);

    // ============ Errors ============

    error RoyaltyManager__InvalidPrice();
    error RoyaltyManager__NotCourseCreator();
    error RoyaltyManager__CourseNotActive();
    error RoyaltyManager__InsufficientPayment();
    error RoyaltyManager__AlreadyPurchased();
    error RoyaltyManager__NoWithdrawals();
    error RoyaltyManager__WithdrawalFailed();
    error RoyaltyManager__InvalidFee();
    error RoyaltyManager__InvalidRecipient();

    // ============ Constructor ============

    constructor(
        address _ipRegistry,
        address _feeRecipient,
        uint256 _platformFeeBps
    ) Ownable(msg.sender) {
        if (_feeRecipient == address(0)) {
            revert RoyaltyManager__InvalidRecipient();
        }
        if (_platformFeeBps > 5000) {
            // Max 50%
            revert RoyaltyManager__InvalidFee();
        }

        ipRegistry = IPRegistry(_ipRegistry);
        feeRecipient = _feeRecipient;
        platformFeeBps = _platformFeeBps;
    }

    // ============ External Functions ============

    /**
     * @notice Set price for a course
     * @param courseId ID of the course
     * @param price Price in wei
     */
    function setCoursePrice(uint256 courseId, uint256 price) external {
        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);

        if (course.creator != msg.sender) {
            revert RoyaltyManager__NotCourseCreator();
        }
        if (!course.isActive) {
            revert RoyaltyManager__CourseNotActive();
        }

        uint256 oldPrice = coursePrice[courseId];
        coursePrice[courseId] = price;

        emit PriceUpdated(courseId, oldPrice, price);
    }

    /**
     * @notice Purchase a course
     * @param courseId ID of the course to purchase
     */
    function purchaseCourse(uint256 courseId) external payable nonReentrant {
        IPRegistry.Course memory course = ipRegistry.getCourse(courseId);

        if (!course.isActive) {
            revert RoyaltyManager__CourseNotActive();
        }
        if (hasPurchased[courseId][msg.sender]) {
            revert RoyaltyManager__AlreadyPurchased();
        }

        uint256 price = coursePrice[courseId];
        if (price == 0) {
            revert RoyaltyManager__InvalidPrice();
        }
        if (msg.value < price) {
            revert RoyaltyManager__InsufficientPayment();
        }

        // Calculate fees
        uint256 platformFee = (price * platformFeeBps) / 10000;
        uint256 creatorAmount = price - platformFee;

        // Update state
        hasPurchased[courseId][msg.sender] = true;
        courseRevenue[courseId] += price;
        pendingWithdrawals[course.creator] += creatorAmount;
        platformEarnings += platformFee;

        // Refund excess payment
        if (msg.value > price) {
            (bool success, ) = msg.sender.call{value: msg.value - price}("");
            if (!success) {
                revert RoyaltyManager__WithdrawalFailed();
            }
        }

        emit CoursePurchased(
            courseId,
            msg.sender,
            price,
            creatorAmount,
            platformFee
        );
    }

    /**
     * @notice Withdraw pending earnings (creator)
     */
    function withdrawEarnings() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];

        if (amount == 0) {
            revert RoyaltyManager__NoWithdrawals();
        }

        pendingWithdrawals[msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: amount}("");
        if (!success) {
            pendingWithdrawals[msg.sender] = amount; // Restore on failure
            revert RoyaltyManager__WithdrawalFailed();
        }

        emit WithdrawalMade(msg.sender, amount);
    }

    /**
     * @notice Withdraw platform earnings (owner only)
     */
    function withdrawPlatformEarnings() external onlyOwner nonReentrant {
        uint256 amount = platformEarnings;

        if (amount == 0) {
            revert RoyaltyManager__NoWithdrawals();
        }

        platformEarnings = 0;

        (bool success, ) = feeRecipient.call{value: amount}("");
        if (!success) {
            platformEarnings = amount;
            revert RoyaltyManager__WithdrawalFailed();
        }

        emit WithdrawalMade(feeRecipient, amount);
    }

    /**
     * @notice Update platform fee (owner only)
     * @param newFeeBps New fee in basis points
     */
    function updatePlatformFee(uint256 newFeeBps) external onlyOwner {
        if (newFeeBps > 5000) {
            revert RoyaltyManager__InvalidFee();
        }

        uint256 oldFee = platformFeeBps;
        platformFeeBps = newFeeBps;

        emit PlatformFeeUpdated(oldFee, newFeeBps);
    }

    /**
     * @notice Update fee recipient (owner only)
     * @param newRecipient New recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyOwner {
        if (newRecipient == address(0)) {
            revert RoyaltyManager__InvalidRecipient();
        }

        address oldRecipient = feeRecipient;
        feeRecipient = newRecipient;

        emit FeeRecipientUpdated(oldRecipient, newRecipient);
    }

    // ============ View Functions ============

    /**
     * @notice Get course price
     * @param courseId ID of the course
     * @return Price in wei
     */
    function getCoursePrice(uint256 courseId) external view returns (uint256) {
        return coursePrice[courseId];
    }

    /**
     * @notice Check if user has purchased course
     * @param courseId ID of the course
     * @param buyer Address of the buyer
     * @return Boolean
     */
    function hasUserPurchased(
        uint256 courseId,
        address buyer
    ) external view returns (bool) {
        return hasPurchased[courseId][buyer];
    }

    /**
     * @notice Get pending withdrawals for creator
     * @param creator Address of the creator
     * @return Amount in wei
     */
    function getPendingWithdrawals(
        address creator
    ) external view returns (uint256) {
        return pendingWithdrawals[creator];
    }

    /**
     * @notice Calculate fees for a given price
     * @param price Course price
     * @return platformFee Platform fee amount
     * @return creatorAmount Amount for creator
     */
    function calculateFees(
        uint256 price
    ) external view returns (uint256 platformFee, uint256 creatorAmount) {
        platformFee = (price * platformFeeBps) / 10000;
        creatorAmount = price - platformFee;
    }
}
