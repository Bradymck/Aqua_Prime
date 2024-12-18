// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SubscriptionManagerSecure is Ownable, ReentrancyGuard, Pausable {
    IERC20 public immutable moonstoneToken;
    address public guardian;
    address public pendingGuardian;
    bool public guardianActive = true;
    
    uint256 public constant GUARDIAN_DELAY = 3 days;
    mapping(bytes32 => uint256) public guardianRemovalRequest;
    
    event GuardianshipTransferStarted(address indexed currentGuardian, address indexed pendingGuardian);
    event GuardianshipTransferred(address indexed oldGuardian, address indexed newGuardian);
    event GuardianRemovalRequested(bytes32 indexed requestId, uint256 executeTime);

    constructor(
        address _moonstoneToken,
        address initialGuardian
    ) {
        moonstoneToken = IERC20(_moonstoneToken);
        guardian = initialGuardian;
        _transferOwnership(msg.sender);
    }
} 