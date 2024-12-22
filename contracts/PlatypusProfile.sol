// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MoonstoneToken.sol";

contract PlatypusProfile is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    MoonstoneToken public moonstoneToken;

    struct ProfileMetadata {
        string name;
        string bio;
        string[] traits;
        uint256 createdAt;
    }

    mapping(uint256 => ProfileMetadata) public profiles;

    constructor(address _moonstoneToken) ERC721("Platypus Profile", "PLYP") Ownable(msg.sender) {
        moonstoneToken = MoonstoneToken(_moonstoneToken);
    }

    function mintProfile(
        address to,
        string memory name,
        string memory bio,
        string[] memory traits,
        string memory tokenURI
    ) public returns (uint256) {
        require(moonstoneToken.burnForProfile(msg.sender), "Failed to burn Moonstones");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        profiles[newTokenId] = ProfileMetadata({
            name: name,
            bio: bio,
            traits: traits,
            createdAt: block.timestamp
        });

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        return newTokenId;
    }

    function getProfile(uint256 tokenId) public view returns (ProfileMetadata memory) {
        require(_exists(tokenId), "Profile does not exist");
        return profiles[tokenId];
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}