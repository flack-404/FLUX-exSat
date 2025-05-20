// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Advanced Recurring Payment Smart Contract
 * @notice Manages automated recurring payments on the blockchain with enhanced security
 * @dev Implements a system for setting up and processing recurring payments with
 *      reentrancy protection and access controls
 */
contract Payroll is Ownable, ReentrancyGuard {
    error InsufficientBalance(uint256 required, uint256 available);
    error InvalidPaymentId(uint256 paymentId);
    error PaymentNotDue(uint256 nextPaymentTime);
    error InvalidRecipient();
    error InvalidAmount();
    error InvalidInterval();
    error TransferFailed();

    // Optimized struct using smaller uint types to save gas
    struct RecurringPayment {
        address recipient;    // Recipient of the payment
        uint96 amount;        // Amount per payment in wei
        uint64 interval;      // Time between payments in seconds
        uint64 lastPayment;   // Timestamp of the last payment
        bool isActive;        // Whether the payment is currently active
    }

    // State variables
    uint256 public totalBalance;
    uint256 public paymentIdCounter;
    mapping(uint256 => RecurringPayment) public recurringPayments;

    // Events for tracking contract activity
    event FundsDeposited(address indexed depositor, uint256 amount);
    event RecurringPaymentCreated(
        uint256 indexed paymentId, 
        address indexed recipient, 
        uint256 amount, 
        uint256 interval
    );
    event RecurringPaymentProcessed(
        uint256 indexed paymentId, 
        address indexed recipient, 
        uint256 amount
    );
    event RecurringPaymentUpdated(
        uint256 indexed paymentId,
        uint256 newAmount,
        uint256 newInterval
    );
    event RecurringPaymentCancelled(uint256 indexed paymentId);
    event FundsTransferred(address indexed recipient, uint256 amount);
    event PaymentFailed(uint256 indexed paymentId, string reason);

    constructor(address initialOwner) Ownable(initialOwner) ReentrancyGuard() {
        // Constructor body can be empty as we're just calling parent constructors
    }

    /**
     * @notice Deposits funds into the contract
     * @dev Increases the total balance of the contract
     */
    function depositFunds() external payable {
        if (msg.value == 0) revert InvalidAmount();
        totalBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Transfers funds to a specified recipient
     * @param recipient Address to receive the transfer
     * @param amount Amount to transfer in wei
     */
    function transfer(
        address recipient, 
        uint256 amount
    ) external onlyOwner nonReentrant {
        if (amount == 0) revert InvalidAmount();
        if (totalBalance < amount) revert InsufficientBalance(amount, totalBalance);

        totalBalance -= amount;
        (bool success, ) = recipient.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit FundsTransferred(recipient, amount);
    }

    /**
     * @notice Returns the current balance of the contract
     * @return uint256 Current balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return totalBalance;
    }

    /**
     * @notice Sets up a new recurring payment
     * @param recipient Address to receive the recurring payment
     * @param amount Amount to be paid in each interval
     * @param interval Time between payments in seconds
     */
    function setupRecurringPayment(
        address recipient,
        uint96 amount,
        uint64 interval
    ) external onlyOwner {
        if (recipient == address(0)) revert InvalidRecipient();
        if (amount == 0) revert InvalidAmount();
        if (interval == 0) revert InvalidInterval();

        recurringPayments[paymentIdCounter] = RecurringPayment({
            recipient: recipient,
            amount: amount,
            interval: interval,
            lastPayment: uint64(block.timestamp),
            isActive: true
        });

        emit RecurringPaymentCreated(
            paymentIdCounter, 
            recipient, 
            amount, 
            interval
        );
        paymentIdCounter++;
    }

    /**
     * @notice Updates an existing recurring payment
     * @param paymentId ID of the payment to update
     * @param newAmount New amount for the payment
     * @param newInterval New interval for the payment
     */
    function updateRecurringPayment(
        uint256 paymentId,
        uint96 newAmount,
        uint64 newInterval
    ) external onlyOwner {
        RecurringPayment storage payment = recurringPayments[paymentId];
        if (!payment.isActive) revert InvalidPaymentId(paymentId);
        if (newAmount == 0) revert InvalidAmount();
        if (newInterval == 0) revert InvalidInterval();
        
        payment.amount = newAmount;
        payment.interval = newInterval;
        
        emit RecurringPaymentUpdated(paymentId, newAmount, newInterval);
    }

    /**
     * @notice Cancels a recurring payment
     * @param paymentId ID of the payment to cancel
     */
    function cancelRecurringPayment(
        uint256 paymentId
    ) external onlyOwner {
        RecurringPayment storage payment = recurringPayments[paymentId];
        if (!payment.isActive) revert InvalidPaymentId(paymentId);
        payment.isActive = false;
        emit RecurringPaymentCancelled(paymentId);
    }

    /**
     * @notice Processes a single recurring payment
     * @param paymentId ID of the payment to process
     * @return success Boolean indicating if the payment was successful
     */
    function processRecurringPayment(
        uint256 paymentId
    ) public nonReentrant returns (bool) {
        RecurringPayment storage payment = recurringPayments[paymentId];
        if (!payment.isActive) revert InvalidPaymentId(paymentId);

        uint256 nextPaymentTime = payment.lastPayment + payment.interval;
        if (block.timestamp < nextPaymentTime) 
            revert PaymentNotDue(nextPaymentTime);

        if (totalBalance < payment.amount)
            revert InsufficientBalance(payment.amount, totalBalance);

        payment.lastPayment = uint64(block.timestamp);
        totalBalance -= payment.amount;

        (bool success, ) = payment.recipient.call{value: payment.amount}("");
        if (!success) {
            totalBalance += payment.amount;
            emit PaymentFailed(paymentId, "Transfer failed");
            revert TransferFailed();
        }

        emit RecurringPaymentProcessed(
            paymentId, 
            payment.recipient, 
            payment.amount
        );
        return true;
    }

    /**
     * @notice Processes multiple recurring payments in a single transaction
     * @param paymentIds Array of payment IDs to process
     */
    function processMultiplePayments(
        uint256[] calldata paymentIds
    ) external nonReentrant {
        for(uint i = 0; i < paymentIds.length; i++) {
            uint256 paymentId = paymentIds[i];
            RecurringPayment storage payment = recurringPayments[paymentId];
            
            // Skip inactive payments
            if (!payment.isActive) {
                continue;
            }

            // Skip payments that aren't due yet
            uint256 nextPaymentTime = payment.lastPayment + payment.interval;
            if (block.timestamp < nextPaymentTime) {
                continue;
            }

            // Skip if insufficient balance
            if (totalBalance < payment.amount) {
                emit PaymentFailed(paymentId, "Insufficient balance");
                continue;
            }

            // Process the payment
            payment.lastPayment = uint64(block.timestamp);
            totalBalance -= payment.amount;

            (bool success, ) = payment.recipient.call{value: payment.amount}("");
            if (!success) {
                totalBalance += payment.amount;
                emit PaymentFailed(paymentId, "Transfer failed");
                continue;
            }

            emit RecurringPaymentProcessed(
                paymentId, 
                payment.recipient, 
                payment.amount
            );
        }
    }

    /**
     * @notice Checks if a payment can be processed
     * @param paymentId ID of the payment to check
     * @return bool Whether the payment can be processed
     */
    function canProcessPayment(
        uint256 paymentId
    ) public view returns (bool) {
        RecurringPayment storage payment = recurringPayments[paymentId];
        return (
            payment.isActive &&
            block.timestamp >= payment.lastPayment + payment.interval &&
            totalBalance >= payment.amount
        );
    }

    function getActivePaymentIds() external view returns (uint256[] memory) {
        // First, count how many active payments we have
        uint256 activeCount = 0;
        for (uint256 i = 0; i < paymentIdCounter; i++) {
            if (recurringPayments[i].isActive) {
                activeCount++;
            }
        }

        // Create an array of the correct size
        uint256[] memory activeIds = new uint256[](activeCount);
        
        // Fill the array with active payment IDs
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < paymentIdCounter; i++) {
            if (recurringPayments[i].isActive) {
                activeIds[currentIndex] = i;
                currentIndex++;
            }
        }

        return activeIds;
    }

    function getPaymentStats() external view returns (
        uint256 totalPayments,
        uint256 activePayments
    ) {
        totalPayments = paymentIdCounter;
        
        uint256 active = 0;
        for (uint256 i = 0; i < paymentIdCounter; i++) {
            if (recurringPayments[i].isActive) {
                active++;
            }
        }
        
        activePayments = active;
        return (totalPayments, activePayments);
    }

    /** 
     * @notice Fallback function to receive funds
     */
    receive() external payable {
        totalBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }

    /** 
     * @notice Fallback function to handle unknown function calls
     */
    fallback() external payable {
        totalBalance += msg.value;
        emit FundsDeposited(msg.sender, msg.value);
    }
}