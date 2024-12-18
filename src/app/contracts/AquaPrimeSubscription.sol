// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AquaPrimeSubscription is Ownable, ReentrancyGuard {
    IERC20 public moonstone;
    
    struct Subscription {
        uint256 startTime;
        uint256 endTime;
        bool hasClaimedTrial;
        uint256 moonstoneAllowance;
    }
    
    mapping(address => Subscription) public subscriptions;
    
    uint256 public constant TRIAL_DURATION = 30 days;
    uint256 public constant SUBSCRIPTION_PRICE = 9.99 ether; // Scaled for precision
    uint256 public constant MONTHLY_MOONSTONE = 100 * 10**18; // 100 Moonstone per month
    
    event TrialStarted(address indexed user);
    event SubscriptionPurchased(address indexed user, uint256 duration);
    event MoonstoneDistributed(address indexed user, uint256 amount);

    constructor(address _moonstone) {
        moonstone = IERC20(_moonstone);
    }

    function startTrial() external {
        require(!subscriptions[msg.sender].hasClaimedTrial, "Trial already claimed");
        
        subscriptions[msg.sender] = Subscription({
            startTime: block.timestamp,
            endTime: block.timestamp + TRIAL_DURATION,
            hasClaimedTrial: true,
            moonstoneAllowance: MONTHLY_MOONSTONE
        });
        
        // Distribute initial moonstone
        moonstone.transfer(msg.sender, MONTHLY_MOONSTONE);
        
        emit TrialStarted(msg.sender);
    }

    function purchaseSubscription(uint256 months) external payable nonReentrant {
        require(msg.value >= SUBSCRIPTION_PRICE * months, "Insufficient payment");
        
        uint256 currentEnd = subscriptions[msg.sender].endTime;
        if (currentEnd < block.timestamp) {
            currentEnd = block.timestamp;
        }
        
        subscriptions[msg.sender].endTime = currentEnd + (months * 30 days);
        subscriptions[msg.sender].moonstoneAllowance += (MONTHLY_MOONSTONE * months);
        
        // Distribute moonstone
        moonstone.transfer(msg.sender, MONTHLY_MOONSTONE * months);
        
        emit SubscriptionPurchased(msg.sender, months);
    }

    function isSubscribed(address user) public view returns (bool) {
        return subscriptions[user].endTime > block.timestamp;
    }
} 