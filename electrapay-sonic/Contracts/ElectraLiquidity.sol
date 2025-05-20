// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ElectraLiquidity
 * @notice Manages liquidity provision for idle funds in the FLUX system
 * @dev Allows users to earn yield on funds waiting to be used for scheduled payments
 */
contract ElectraLiquidity is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    error InsufficientBalance();
    error PositionNotFound();
    error PositionLocked();
    error PoolNotFound();
    error InvalidAmount();
    error InvalidLockPeriod();
    error UnauthorizedAccess();
    error NoEarnings();
    error WithdrawalFailed();

    // Struct for pool definition
    struct Pool {
        string id;
        string name;
        uint256 apy;      // APY in basis points (100 = 1%)
        uint256 riskLevel; // 1 = Low, 2 = Medium, 3 = High
        bool isActive;    
    }

    // Struct for user's liquidity position
    struct Position {
        string id;
        address owner;
        string poolId;
        uint256 amount;
        uint256 depositTime;
        uint256 lockPeriod;  // Lock period in seconds (0 = no lock)
        uint256 lastHarvestTime;
        uint256 pendingRewards;
        bool isActive;
    }

    // State variables
    mapping(string => Pool) public pools;
    string[] public poolIds;
    
    mapping(string => Position) public positions;
    string[] public positionIds;
    mapping(address => string[]) public userPositions;
    
    // Lock period bonus tiers (in basis points)
    mapping(uint256 => uint256) public lockBonuses;
    
    // Contract from which automatic withdrawals can be triggered (Payment Agent)
    address public paymentAgent;
    
    // Payroll contract address
    address public payrollContract;
    
    // Events
    event PoolCreated(string id, string name, uint256 apy, uint256 riskLevel);
    event PoolUpdated(string id, uint256 apy, uint256 riskLevel, bool isActive);
    
    event PositionCreated(string id, address indexed owner, string poolId, uint256 amount, uint256 lockPeriod);
    event PositionUpdated(string id, uint256 newAmount);
    event PositionWithdrawn(string id, address indexed owner, uint256 amount);
    event YieldHarvested(string id, address indexed owner, uint256 amount);
    
    event PaymentAgentUpdated(address newPaymentAgent);
    event PayrollContractUpdated(address newPayrollContract);
    event LockBonusUpdated(uint256 lockPeriod, uint256 bonusBasisPoints);

    constructor(address initialOwner, address _payrollContract) Ownable(initialOwner) ReentrancyGuard() {
        payrollContract = _payrollContract;
        
        // Setup default lock bonuses
        lockBonuses[7 days] = 50;    // 7 days = +0.5% APY
        lockBonuses[30 days] = 200;  // 30 days = +2% APY
        lockBonuses[90 days] = 500;  // 90 days = +5% APY
        
        // Create default pools
        _createPool("usdc-btc", "USDC-BTC", 820, 1); // 8.20% APY, Low risk
        _createPool("wbtc-btc", "WBTC-BTC", 650, 1); // 6.50% APY, Low risk
        _createPool("usdt-btc", "USDT-BTC", 780, 1); // 7.80% APY, Low risk
        _createPool("dai-usdc", "DAI-USDC", 520, 1); // 5.20% APY, Low risk
        _createPool("sblz-btc", "SBLZ-BTC", 1240, 2); // 12.40% APY, Medium risk
    }
    
    /**
     * @notice Set the payment agent address
     * @param _paymentAgent Address of the payment agent
     */
    function setPaymentAgent(address _paymentAgent) external onlyOwner {
        paymentAgent = _paymentAgent;
        emit PaymentAgentUpdated(_paymentAgent);
    }
    
    /**
     * @notice Update the payroll contract address
     * @param _payrollContract Address of the payroll contract
     */
    function setPayrollContract(address _payrollContract) external onlyOwner {
        payrollContract = _payrollContract;
        emit PayrollContractUpdated(_payrollContract);
    }
    
    /**
     * @notice Create a new liquidity pool
     * @param _id Pool identifier
     * @param _name Pool name
     * @param _apy Annual percentage yield in basis points
     * @param _riskLevel Risk level (1=Low, 2=Medium, 3=High)
     */
    function createPool(string calldata _id, string calldata _name, uint256 _apy, uint256 _riskLevel) external onlyOwner {
        _createPool(_id, _name, _apy, _riskLevel);
    }
    
    /**
     * @notice Internal function to create a pool
     */
    function _createPool(string memory _id, string memory _name, uint256 _apy, uint256 _riskLevel) internal {
        pools[_id] = Pool({
            id: _id,
            name: _name,
            apy: _apy,
            riskLevel: _riskLevel,
            isActive: true
        });
        
        poolIds.push(_id);
        emit PoolCreated(_id, _name, _apy, _riskLevel);
    }
    
    /**
     * @notice Update an existing pool
     * @param _id Pool identifier
     * @param _apy New APY (in basis points)
     * @param _riskLevel New risk level
     * @param _isActive Whether the pool is active
     */
    function updatePool(string calldata _id, uint256 _apy, uint256 _riskLevel, bool _isActive) external onlyOwner {
        if (bytes(pools[_id].id).length == 0) revert PoolNotFound();
        
        pools[_id].apy = _apy;
        pools[_id].riskLevel = _riskLevel;
        pools[_id].isActive = _isActive;
        
        emit PoolUpdated(_id, _apy, _riskLevel, _isActive);
    }
    
    /**
     * @notice Set bonus for a lock period
     * @param _lockPeriod Lock period in seconds
     * @param _bonusBasisPoints Bonus in basis points
     */
    function setLockBonus(uint256 _lockPeriod, uint256 _bonusBasisPoints) external onlyOwner {
        lockBonuses[_lockPeriod] = _bonusBasisPoints;
        emit LockBonusUpdated(_lockPeriod, _bonusBasisPoints);
    }
    
    /**
     * @notice Deposit funds to a liquidity pool
     * @param _poolId Pool identifier
     * @param _lockPeriod Lock period in seconds (0 = no lock)
     */
    function depositToLiquidityPool(string calldata _poolId, uint256 _lockPeriod) external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();
        if (bytes(pools[_poolId].id).length == 0 || !pools[_poolId].isActive) revert PoolNotFound();
        
        // Validate lock period (must be 0 or a valid lock period with bonus)
        if (_lockPeriod != 0 && lockBonuses[_lockPeriod] == 0) revert InvalidLockPeriod();
        
        // Generate a unique position ID
        string memory positionId = string(abi.encodePacked(
            "pos-",
            _toString(userPositions[msg.sender].length + 1),
            "-",
            _toString(block.timestamp)
        ));
        
        // Create the position
        positions[positionId] = Position({
            id: positionId,
            owner: msg.sender,
            poolId: _poolId,
            amount: msg.value,
            depositTime: block.timestamp,
            lockPeriod: _lockPeriod,
            lastHarvestTime: block.timestamp,
            pendingRewards: 0,
            isActive: true
        });
        
        // Track the position
        positionIds.push(positionId);
        userPositions[msg.sender].push(positionId);
        
        emit PositionCreated(positionId, msg.sender, _poolId, msg.value, _lockPeriod);
    }
    
    /**
     * @notice Withdraw funds from a liquidity position
     * @param _positionId Position identifier
     */
    function withdrawFromLiquidityPool(string calldata _positionId) external nonReentrant {
        Position storage position = positions[_positionId];
        
        // Verify the position exists and belongs to the sender
        if (!position.isActive) revert PositionNotFound();
        if (position.owner != msg.sender && msg.sender != paymentAgent) revert UnauthorizedAccess();
        
        // Check if the position is still locked
        if (position.lockPeriod > 0 && block.timestamp < position.depositTime + position.lockPeriod) {
            // Only the payment agent can withdraw locked positions for scheduled payments
            if (msg.sender != paymentAgent) revert PositionLocked();
        }
        
        // Calculate pending rewards
        uint256 pendingRewards = calculatePendingRewards(_positionId);
        uint256 totalAmount = position.amount + pendingRewards;
        
        // Mark position as inactive
        position.isActive = false;
        
        // Transfer funds
        (bool success, ) = payable(position.owner).call{value: totalAmount}("");
        if (!success) revert WithdrawalFailed();
        
        emit PositionWithdrawn(_positionId, position.owner, totalAmount);
    }
    
    /**
     * @notice Withdraw funds from multiple positions for the same user
     * @param _positionIds Array of position identifiers
     * @dev Used by the payment agent to withdraw funds for scheduled payments
     */
    function batchWithdraw(string[] calldata _positionIds) external nonReentrant {
        if (msg.sender != paymentAgent) revert UnauthorizedAccess();
        
        uint256 totalAmount = 0;
        address positionOwner;
        
        for (uint i = 0; i < _positionIds.length; i++) {
            Position storage position = positions[_positionIds[i]];
            
            // Skip inactive positions
            if (!position.isActive) continue;
            
            // Set position owner (all positions must belong to the same owner)
            if (i == 0) {
                positionOwner = position.owner;
            } else if (position.owner != positionOwner) {
                continue; // Skip positions from different owners
            }
            
            // Calculate rewards and add to total
            uint256 pendingRewards = calculatePendingRewards(_positionIds[i]);
            totalAmount += position.amount + pendingRewards;
            
            // Mark position as inactive
            position.isActive = false;
            
            emit PositionWithdrawn(_positionIds[i], position.owner, position.amount + pendingRewards);
        }
        
        // Transfer total funds to the owner
        if (totalAmount > 0 && positionOwner != address(0)) {
            (bool success, ) = payable(positionOwner).call{value: totalAmount}("");
            if (!success) revert WithdrawalFailed();
        }
    }
    
    /**
     * @notice Harvest yield from a position without withdrawing the principal
     * @param _positionId Position identifier
     */
    function harvestYield(string calldata _positionId) external nonReentrant {
        Position storage position = positions[_positionId];
        
        // Verify the position exists and belongs to the sender
        if (!position.isActive) revert PositionNotFound();
        if (position.owner != msg.sender) revert UnauthorizedAccess();
        
        // Calculate pending rewards
        uint256 pendingRewards = calculatePendingRewards(_positionId);
        if (pendingRewards == 0) revert NoEarnings();
        
        // Update last harvest time
        position.lastHarvestTime = block.timestamp;
        
        // Transfer rewards
        (bool success, ) = payable(msg.sender).call{value: pendingRewards}("");
        if (!success) revert WithdrawalFailed();
        
        emit YieldHarvested(_positionId, msg.sender, pendingRewards);
    }
    
    /**
     * @notice Add more funds to an existing position
     * @param _positionId Position identifier
     */
    function addToPosition(string calldata _positionId) external payable nonReentrant {
        if (msg.value == 0) revert InvalidAmount();
        
        Position storage position = positions[_positionId];
        
        // Verify the position exists and belongs to the sender
        if (!position.isActive) revert PositionNotFound();
        if (position.owner != msg.sender) revert UnauthorizedAccess();
        
        // Harvest pending rewards first
        uint256 pendingRewards = calculatePendingRewards(_positionId);
        if (pendingRewards > 0) {
            // Transfer rewards
            (bool success, ) = payable(msg.sender).call{value: pendingRewards}("");
            if (!success) revert WithdrawalFailed();
            
            emit YieldHarvested(_positionId, msg.sender, pendingRewards);
        }
        
        // Update position amount and harvest time
        position.amount += msg.value;
        position.lastHarvestTime = block.timestamp;
        
        emit PositionUpdated(_positionId, position.amount);
    }
    
    /**
     * @notice Calculate pending rewards for a position
     * @param _positionId Position identifier
     * @return pendingRewards Pending rewards in wei
     */
    function calculatePendingRewards(string memory _positionId) public view returns (uint256)
 {
        Position storage position = positions[_positionId];
        
        if (!position.isActive) return 0;
        
        // Get the pool APY
        Pool storage pool = pools[position.poolId];
        
        // Calculate effective APY (base APY + lock bonus)
        uint256 effectiveApy = pool.apy;
        if (position.lockPeriod > 0) {
            effectiveApy += lockBonuses[position.lockPeriod];
        }
        
        // Calculate time elapsed since last harvest (in seconds)
        uint256 timeElapsed = block.timestamp - position.lastHarvestTime;
        
        // Calculate rewards: principal * APY * timeElapsed / (365 days in seconds)
        pendingRewards = (position.amount * effectiveApy * timeElapsed) / (10000 * 365 days);
        
        return pendingRewards;
    }
    
    /**
     * @notice Get all pools
     * @return Array of all pools
     */
    function getAllPools() external view returns (Pool[] memory) {
        Pool[] memory result = new Pool[](poolIds.length);
        
        for (uint i = 0; i < poolIds.length; i++) {
            result[i] = pools[poolIds[i]];
        }
        
        return result;
    }
    
    /**
     * @notice Get active pools
     * @return Array of active pools
     */
    function getActivePools() external view returns (Pool[] memory) {
        // First, count active pools
        uint256 activeCount = 0;
        for (uint i = 0; i < poolIds.length; i++) {
            if (pools[poolIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create result array of correct size
        Pool[] memory result = new Pool[](activeCount);
        
        // Fill result array
        uint256 resultIndex = 0;
        for (uint i = 0; i < poolIds.length; i++) {
            if (pools[poolIds[i]].isActive) {
                result[resultIndex] = pools[poolIds[i]];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @notice Get positions for a user
     * @param _user User address
     * @return Array of user's positions
     */
    function getUserPositions(address _user) external view returns (Position[] memory) {
        string[] memory userPositionIds = userPositions[_user];
        Position[] memory result = new Position[](userPositionIds.length);
        
        for (uint i = 0; i < userPositionIds.length; i++) {
            result[i] = positions[userPositionIds[i]];
        }
        
        return result;
    }
    
    /**
     * @notice Get user's active positions
     * @param _user User address
     * @return Array of user's active positions
     */
    function getUserActivePositions(address _user) external view returns (Position[] memory) {
        string[] memory userPositionIds = userPositions[_user];
        
        // First, count active positions
        uint256 activeCount = 0;
        for (uint i = 0; i < userPositionIds.length; i++) {
            if (positions[userPositionIds[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create result array of correct size
        Position[] memory result = new Position[](activeCount);
        
        // Fill result array
        uint256 resultIndex = 0;
        for (uint i = 0; i < userPositionIds.length; i++) {
            if (positions[userPositionIds[i]].isActive) {
                result[resultIndex] = positions[userPositionIds[i]];
                resultIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @notice Get user stats
     * @param _user User address
     * @return totalDeposited Total amount deposited
     * @return totalActiveDeposits Total amount in active positions
     * @return totalPositions Total number of positions
     * @return activePositions Number of active positions
     * @return totalPendingRewards Total pending rewards across all positions
     */
    function getUserStats(address _user) external view returns (
        uint256 totalDeposited,
        uint256 totalActiveDeposits,
        uint256 totalPositions,
        uint256 activePositions,
        uint256 totalPendingRewards
    ) {
        string[] memory userPositionIds = userPositions[_user];
        totalPositions = userPositionIds.length;
        
        for (uint i = 0; i < userPositionIds.length; i++) {
            Position storage position = positions[userPositionIds[i]];
            totalDeposited += position.amount;
            
            if (position.isActive) {
                activePositions++;
                totalActiveDeposits += position.amount;
                totalPendingRewards += calculatePendingRewards(userPositionIds[i]);
            }
        }
        
        return (totalDeposited, totalActiveDeposits, totalPositions, activePositions, totalPendingRewards);
    }
    
    /**
     * @notice Emergency withdrawal by contract owner
     * @dev Only to be used in case of emergency
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        if (_amount > address(this).balance) {
            _amount = address(this).balance;
        }
        
        (bool success, ) = payable(owner()).call{value: _amount}("");
        require(success, "Emergency withdrawal failed");
    }
    
    /**
     * @notice Utility function to convert uint to string
     * @param _value Value to convert
     * @return String representation
     */
    function _toString(uint256 _value) internal pure returns (string memory) {
        if (_value == 0) {
            return "0";
        }
        
        uint256 temp = _value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (_value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + _value % 10));
            _value /= 10;
        }
        
        return string(buffer);
    }
    
    /**
     * @notice Receive BTC
     */
    receive() external payable {
        // Just receive BTC, no specific action needed
    }
}