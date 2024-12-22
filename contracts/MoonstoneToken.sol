// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoonstoneToken is ERC20, Ownable {
    uint256 public constant PROFILE_GENERATION_COST = 10 * 10**18; // 10 Moonstones

    constructor() ERC20("Moonstone", "MOON") Ownable(msg.sender) {
        // Mint initial supply to contract owner
        _mint(msg.sender, 1000000 * 10**18); // 1 million Moonstones
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burnForProfile(address from) public returns (bool) {
        require(balanceOf(from) >= PROFILE_GENERATION_COST, "Insufficient Moonstone balance");
        _burn(from, PROFILE_GENERATION_COST);
        return true;
    }
}