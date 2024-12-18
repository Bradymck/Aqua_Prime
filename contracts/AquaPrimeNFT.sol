// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AquaPrimeNFT is ERC721, ReentrancyGuard {
    IERC20 public moonstone;
    
    uint256 public totalSupply;
    uint256 public constant MINT_PRICE = 100 * 10**18; // 100 Moonstone
    
    // Bonding curve parameters
    uint256 public constant CURVE_FACTOR = 115; // 15% increase per mint
    uint256 public constant CURVE_DENOMINATOR = 100;

    mapping(uint256 => string) public tokenURI;
    mapping(uint256 => uint256) public lastInteraction;

    event AICompanionMinted(address indexed owner, uint256 indexed tokenId);
    event AICompanionBurned(address indexed owner, uint256 indexed tokenId);

    constructor(address _moonstone) ERC721("AquaPrime AI Companion", "AQUA") {
        moonstone = IERC20(_moonstone);
    }

    function calculateMintPrice(uint256 tokenId) public pure returns (uint256) {
        return MINT_PRICE * (CURVE_FACTOR ** tokenId) / (CURVE_DENOMINATOR ** tokenId);
    }

    function mintCompanion(string memory _tokenURI) external nonReentrant {
        uint256 price = calculateMintPrice(totalSupply);
        require(moonstone.transferFrom(msg.sender, address(this), price), "Moonstone transfer failed");
        
        uint256 tokenId = totalSupply++;
        _safeMint(msg.sender, tokenId);
        tokenURI[tokenId] = _tokenURI;
        lastInteraction[tokenId] = block.timestamp;
        
        emit AICompanionMinted(msg.sender, tokenId);
    }

    function burnCompanion(uint256 tokenId) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        // Calculate moonstone return based on time held
        uint256 timeHeld = block.timestamp - lastInteraction[tokenId];
        uint256 returnAmount = calculateBurnReturn(tokenId, timeHeld);
        
        _burn(tokenId);
        require(moonstone.transfer(msg.sender, returnAmount), "Return transfer failed");
        
        emit AICompanionBurned(msg.sender, tokenId);
    }

    function calculateBurnReturn(uint256 tokenId, uint256 timeHeld) public pure returns (uint256) {
        uint256 baseReturn = calculateMintPrice(tokenId) / 2; // 50% base return
        // Additional return based on time held, max 25% bonus
        uint256 timeBonus = (baseReturn * timeHeld * 25) / (365 days * 100);
        return baseReturn + timeBonus;
    }
} 