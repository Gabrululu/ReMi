// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// @ts-ignore - Solidity imports work correctly with Hardhat
// @solidity-ignore - OpenZeppelin imports are resolved by Hardhat
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract RemiToken is ERC20, Ownable, Pausable {
    // Events
    event TaskCompleted(address indexed user, uint256 taskId, uint256 reward);
    event StreakBonus(address indexed user, uint256 streak, uint256 bonus);
    event FarcasterShare(address indexed user, uint256 reward);
    event WeeklyGoal(address indexed user, uint256 goalId, uint256 reward);

    // Task completion tracking
    mapping(address => uint256) public completedTasks;
    mapping(address => uint256) public currentStreak;
    mapping(address => uint256) public lastCompletionDate;
    mapping(address => uint256) public weeklyGoalsCompleted;

    // Reward amounts
    uint256 public constant TASK_REWARD_BASE = 10;
    uint256 public constant STREAK_BONUS_MULTIPLIER = 2;
    uint256 public constant FARCASTER_SHARE_REWARD = 5;
    uint256 public constant WEEKLY_GOAL_REWARD = 100;

    // Priority multipliers
    mapping(string => uint256) public priorityMultipliers;

    constructor() ERC20("ReMi Token", "REMI") Ownable(msg.sender) {
        // Set priority multipliers
        priorityMultipliers["LOW"] = 1;
        priorityMultipliers["MEDIUM"] = 2;
        priorityMultipliers["HIGH"] = 3;
        priorityMultipliers["URGENT"] = 5;
    }

    /**
     * @dev Complete a task and receive rewards
     * @param taskId Unique identifier for the task
     * @param priority Task priority (LOW, MEDIUM, HIGH, URGENT)
     */
    function completeTask(uint256 taskId, string memory priority) external whenNotPaused {
        require(bytes(priority).length > 0, "Priority cannot be empty");
        
        uint256 baseReward = TASK_REWARD_BASE * priorityMultipliers[priority];
        uint256 streakBonus = calculateStreakBonus(msg.sender);
        uint256 totalReward = baseReward + streakBonus;

        // Update user stats
        completedTasks[msg.sender]++;
        updateStreak(msg.sender);
        lastCompletionDate[msg.sender] = block.timestamp;

        // Mint rewards
        _mint(msg.sender, totalReward);

        emit TaskCompleted(msg.sender, taskId, totalReward);
        
        if (streakBonus > 0) {
            emit StreakBonus(msg.sender, currentStreak[msg.sender], streakBonus);
        }
    }

    /**
     * @dev Reward for sharing on Farcaster
     */
    function rewardFarcasterShare() external whenNotPaused {
        _mint(msg.sender, FARCASTER_SHARE_REWARD);
        emit FarcasterShare(msg.sender, FARCASTER_SHARE_REWARD);
    }

    /**
     * @dev Complete weekly goal
     * @param goalId Unique identifier for the weekly goal
     */
    function completeWeeklyGoal(uint256 goalId) external whenNotPaused {
        weeklyGoalsCompleted[msg.sender]++;
        _mint(msg.sender, WEEKLY_GOAL_REWARD);
        emit WeeklyGoal(msg.sender, goalId, WEEKLY_GOAL_REWARD);
    }

    /**
     * @dev Calculate streak bonus based on consecutive days
     */
    function calculateStreakBonus(address user) internal view returns (uint256) {
        uint256 streak = currentStreak[user];
        if (streak < 3) return 0;
        if (streak < 7) return TASK_REWARD_BASE;
        if (streak < 14) return TASK_REWARD_BASE * 2;
        if (streak < 30) return TASK_REWARD_BASE * 3;
        return TASK_REWARD_BASE * 5;
    }

    /**
     * @dev Update user streak
     */
    function updateStreak(address user) internal {
        uint256 lastCompletion = lastCompletionDate[user];
        uint256 today = block.timestamp / 1 days;
        uint256 lastDay = lastCompletion / 1 days;

        if (lastCompletion == 0 || today > lastDay) {
            if (today == lastDay + 1) {
                currentStreak[user]++;
            } else {
                currentStreak[user] = 1;
            }
        }
    }

    /**
     * @dev Get user statistics
     */
    function getUserStats(address user) external view returns (
        uint256 tasksCompleted,
        uint256 streak,
        uint256 balance,
        uint256 weeklyGoals
    ) {
        return (
            completedTasks[user],
            currentStreak[user],
            balanceOf(user),
            weeklyGoalsCompleted[user]
        );
    }

    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Mint tokens (owner only, for initial distribution)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Override transfer to check for paused state
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(!paused(), "Token transfer while paused");
        super._update(from, to, amount);
    }
} 