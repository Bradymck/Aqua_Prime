// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AquaPrimeNFT is ERC721URIStorage, ReentrancyGuard {
    IERC20 public immutable moonstone;
    uint256 private _tokenIdCounter;
    
    mapping(uint256 => uint256) public lastInteraction;

    event AICompanionMinted(address indexed owner, uint256 indexed tokenId);
    event AICompanionBurned(address indexed owner, uint256 indexed tokenId);

    constructor(address _moonstone) ERC721("AquaPrime AI Companion", "AQUA") {
        moonstone = IERC20(_moonstone);
    }

    function mintCompanion(string memory uri) external nonReentrant returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        lastInteraction[tokenId] = block.timestamp;
        
        emit AICompanionMinted(msg.sender, tokenId);
        return tokenId;
    }

    // Rest of your functions...
}
