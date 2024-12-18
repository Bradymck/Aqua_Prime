// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SubscriptionManagerAutomated is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable moonstoneToken;
    
    struct Subscription {
        uint256 startTime;
        uint256 endTime;
        uint256 lastProcessed;
        uint256 monthlyAllowance;
        bool active;
        bool autoRenew;
    }
    
    mapping(address => Subscription) public subscriptions;
    uint256 public subscriptionPrice;
    uint256 public constant MONTHLY_MOONSTONE = 100 * 10**18; // 100 tokens
    uint256 public constant MAX_PROCESSING_ITERATIONS = 10;
    
    event SubscriptionCreated(address indexed user, uint256 duration);
    event SubscriptionRenewed(address indexed user, uint256 newEndTime);
    event SubscriptionCancelled(address indexed user);
    event AllowanceProcessed(address indexed user, uint256 amount);
    event AutoRenewToggled(address indexed user, bool enabled);
    event PriceUpdated(uint256 newPrice);
    
    constructor(address _moonstoneToken) {
        moonstoneToken = IERC20(_moonstoneToken);
        _transferOwnership(msg.sender);
    }
    
    function setPrice(uint256 newPrice) external onlyOwner {
        subscriptionPrice = newPrice;
        emit PriceUpdated(newPrice);
    }
    
    function subscribe(uint256 duration, bool autoRenew) external nonReentrant whenNotPaused {
        require(duration > 0, "Invalid duration");
        uint256 totalPrice = subscriptionPrice * duration;
        
        require(moonstoneToken.transferFrom(msg.sender, address(this), totalPrice), "Payment failed");
        
        Subscription storage sub = subscriptions[msg.sender];
        if (sub.active) {
            require(block.timestamp > sub.endTime, "Active subscription exists");
        }
        
        sub.startTime = block.timestamp;
        sub.endTime = block.timestamp + (duration * 30 days);
        sub.lastProcessed = block.timestamp;
        sub.monthlyAllowance = MONTHLY_MOONSTONE;
        sub.active = true;
        sub.autoRenew = autoRenew;
        
        emit SubscriptionCreated(msg.sender, duration);
    }
    
    function toggleAutoRenew() external {
        Subscription storage sub = subscriptions[msg.sender];
        require(sub.active, "No active subscription");
        sub.autoRenew = !sub.autoRenew;
        emit AutoRenewToggled(msg.sender, sub.autoRenew);
    }
    
    function processSubscriptions(address[] calldata users) external nonReentrant {
        require(users.length <= MAX_PROCESSING_ITERATIONS, "Too many users");
        
        for (uint i = 0; i < users.length; i++) {
            Subscription storage sub = subscriptions[users[i]];
            if (!sub.active) continue;
            
            // Process monthly allowance
            uint256 monthsPassed = (block.timestamp - sub.lastProcessed) / 30 days;
            if (monthsPassed > 0) {
                uint256 allowance = monthsPassed * sub.monthlyAllowance;
                if (allowance > 0) {
                    require(moonstoneToken.transfer(users[i], allowance), "Allowance transfer failed");
                    emit AllowanceProcessed(users[i], allowance);
                }
                sub.lastProcessed += monthsPassed * 30 days;
            }
            
            // Handle subscription expiry and auto-renewal
            if (block.timestamp > sub.endTime) {
                if (sub.autoRenew && moonstoneToken.balanceOf(users[i]) >= subscriptionPrice) {
                    if (moonstoneToken.transferFrom(users[i], address(this), subscriptionPrice)) {
                        sub.endTime += 30 days;
                        emit SubscriptionRenewed(users[i], sub.endTime);
                    } else {
                        sub.active = false;
                        emit SubscriptionCancelled(users[i]);
                    }
                } else {
                    sub.active = false;
                    emit SubscriptionCancelled(users[i]);
                }
            }
        }
    }
    
    function cancelSubscription() external {
        Subscription storage sub = subscriptions[msg.sender];
        require(sub.active, "No active subscription");
        sub.active = false;
        sub.autoRenew = false;
        emit SubscriptionCancelled(msg.sender);
    }
    
    function getSubscriptionStatus(address user) external view returns (
        bool active,
        uint256 endTime,
        bool autoRenew,
        uint256 monthlyAllowance
    ) {
        Subscription memory sub = subscriptions[user];
        return (sub.active, sub.endTime, sub.autoRenew, sub.monthlyAllowance);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = moonstoneToken.balanceOf(address(this));
        require(moonstoneToken.transfer(owner(), balance), "Withdrawal failed");
    }
} 