// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CourseDirectory} from "./courseDirectory.sol";
import {IPRegistry} from "./IpRegistry.sol";

/**
 * @title CertificateNFT
 * @notice Soulbound NFT certificates for course completion
 * @dev Non-transferable achievement tokens
 */
contract CertificateNFT is ERC721, ERC721URIStorage, Ownable {
    // ============ State Variables ============

    CourseDirectory public immutable courseDirectory;
    IPRegistry public immutable ipRegistry;

    struct Certificate {
        uint256 courseId;
        address learner;
        uint256 completionDate;
        uint256 score; // Optional: 0-100
        string metadataUri; // IPFS link to certificate metadata
    }

    uint256 private _tokenIdCounter;

    // Token ID to Certificate
    mapping(uint256 => Certificate) private _certificates;

    // Learner + Course => Token ID (prevent duplicates)
    mapping(address => mapping(uint256 => uint256))
        private _learnerCourseCertificate;

    // Learner => all their certificate token IDs
    mapping(address => uint256[]) private _learnerCertificates;

    // ============ Events ============

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed learner,
        uint256 indexed courseId,
        uint256 timestamp
    );

    // ============ Errors ============

    error CertificateNFT__TransferNotAllowed();
    error CertificateNFT__NotCompleted();
    error CertificateNFT__AlreadyIssued();
    error CertificateNFT__InvalidScore();

    // ============ Constructor ============

    constructor(
        address _courseDirectory,
        address _ipRegistry
    ) ERC721("BLOCKEDLEARNING Certificate", "BLCERT") Ownable(msg.sender) {
        courseDirectory = CourseDirectory(_courseDirectory);
        ipRegistry = IPRegistry(_ipRegistry);
        _tokenIdCounter = 1;
    }

    // ============ External Functions ============

    /**
     * @notice Mint a certificate for course completion
     * @param courseId ID of completed course
     * @param score Optional score (0-100), use 0 if not applicable
     * @param metadataUri IPFS URI for certificate metadata
     */
    function mintCertificate(
        uint256 courseId,
        uint256 score,
        string calldata metadataUri
    ) external returns (uint256) {
        // Verify completion
        if (!courseDirectory.hasCompleted(courseId, msg.sender)) {
            revert CertificateNFT__NotCompleted();
        }

        // Check if already issued
        if (_learnerCourseCertificate[msg.sender][courseId] != 0) {
            revert CertificateNFT__AlreadyIssued();
        }

        // Validate score
        if (score > 100) {
            revert CertificateNFT__InvalidScore();
        }

        uint256 tokenId = _tokenIdCounter++;

        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataUri);

        // Store certificate data
        _certificates[tokenId] = Certificate({
            courseId: courseId,
            learner: msg.sender,
            completionDate: block.timestamp,
            score: score,
            metadataUri: metadataUri
        });

        // Update mappings
        _learnerCourseCertificate[msg.sender][courseId] = tokenId;
        _learnerCertificates[msg.sender].push(tokenId);

        emit CertificateIssued(tokenId, msg.sender, courseId, block.timestamp);

        return tokenId;
    }

    // ============ Override Transfer Functions (Soulbound) ============

    /**
     * @dev Override to make tokens non-transferable (soulbound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0))
        // Block all transfers (from != address(0) && to != address(0))
        if (from != address(0) && to != address(0)) {
            revert CertificateNFT__TransferNotAllowed();
        }

        return super._update(to, tokenId, auth);
    }

    // ============ View Functions ============

    /**
     * @notice Get certificate details
     * @param tokenId Certificate token ID
     * @return Certificate struct
     */
    function getCertificate(
        uint256 tokenId
    ) external view returns (Certificate memory) {
        return _certificates[tokenId];
    }

    /**
     * @notice Get all certificates for a learner
     * @param learner Address of the learner
     * @return Array of token IDs
     */
    function getLearnerCertificates(
        address learner
    ) external view returns (uint256[] memory) {
        return _learnerCertificates[learner];
    }

    /**
     * @notice Check if learner has certificate for course
     * @param learner Address of the learner
     * @param courseId ID of the course
     * @return Token ID (0 if not issued)
     */
    function getCertificateForCourse(
        address learner,
        uint256 courseId
    ) external view returns (uint256) {
        return _learnerCourseCertificate[learner][courseId];
    }

    /**
     * @notice Get total certificates issued
     * @return Total count
     */
    function getTotalCertificates() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    // ============ Required Overrides ============

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
