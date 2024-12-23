// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MoonstoneToken is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("Moonstone", "MOON")
        Ownable(initialOwner)
    {
        // Initial supply of 1,000,000 tokens with 18 decimals
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}