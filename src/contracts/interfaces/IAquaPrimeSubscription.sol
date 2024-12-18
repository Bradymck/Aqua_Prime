// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IAquaPrimeSubscription {
    struct Subscription {
        uint256 startTime;
        uint256 endTime;
        bool hasClaimedTrial;
        uint256 moonstoneAllowance;
    }

    function subscribe(uint256 duration) external payable;
    function startTrial() external;
    function isSubscribed(address user) external view returns (bool);
    function getSubscription(address user) external view returns (Subscription memory);
} 