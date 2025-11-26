// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {IPRegistry} from "../src/IpRegistry.sol";
import {CourseDirectory} from "../src/courseDirectory.sol";
import {CertificateNFT} from "../src/CertificateNft.sol";

contract CertificateNFTTest is Test {
    IPRegistry public ipRegistry;
    CourseDirectory public courseDirectory;
    CertificateNFT public certificateNFT;

    address public creator;
    address public learner1;
    address public learner2;

    uint256 public courseId;

    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed learner,
        uint256 indexed courseId,
        uint256 timestamp
    );

    function setUp() public {
        creator = makeAddr("creator");
        learner1 = makeAddr("learner1");
        learner2 = makeAddr("learner2");

        // Deploy contracts
        ipRegistry = new IPRegistry();
        courseDirectory = new CourseDirectory(address(ipRegistry));
        certificateNFT = new CertificateNFT(
            address(courseDirectory),
            address(ipRegistry)
        );

        // Register a course
        vm.prank(creator);
        string[] memory tags = new string[](1);
        tags[0] = "blockchain";
        courseId = ipRegistry.registerCourse("QmTest123", tags, 500);
    }

    function _completeCourse(address learner) internal {
        vm.startPrank(learner);
        courseDirectory.enrollCourse(courseId);
        courseDirectory.completeCourse(courseId);
        vm.stopPrank();
    }

    function testMintCertificate() public {
        _completeCourse(learner1);

        vm.expectEmit(true, true, true, true);
        emit CertificateIssued(1, learner1, courseId, block.timestamp);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        assertEq(tokenId, 1);
        assertEq(certificateNFT.ownerOf(tokenId), learner1);
        assertEq(certificateNFT.tokenURI(tokenId), "ipfs://QmCert123");
    }

    function testCannotMintWithoutCompletion() public {
        vm.prank(learner1);
        vm.expectRevert(CertificateNFT.CertificateNFT__NotCompleted.selector);
        certificateNFT.mintCertificate(courseId, 95, "ipfs://QmCert123");
    }

    function testCannotMintDuplicate() public {
        _completeCourse(learner1);

        vm.startPrank(learner1);
        certificateNFT.mintCertificate(courseId, 95, "ipfs://QmCert123");

        vm.expectRevert(CertificateNFT.CertificateNFT__AlreadyIssued.selector);
        certificateNFT.mintCertificate(courseId, 90, "ipfs://QmCert456");
        vm.stopPrank();
    }

    function testInvalidScore() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        vm.expectRevert(CertificateNFT.CertificateNFT__InvalidScore.selector);
        certificateNFT.mintCertificate(courseId, 101, "ipfs://QmCert123");
    }

    function testGetCertificate() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        CertificateNFT.Certificate memory cert = certificateNFT.getCertificate(
            tokenId
        );

        assertEq(cert.courseId, courseId);
        assertEq(cert.learner, learner1);
        assertEq(cert.score, 95);
        assertEq(cert.metadataUri, "ipfs://QmCert123");
        assertEq(cert.completionDate, block.timestamp);
    }

    function testGetLearnerCertificates() public {
        // Complete 2 courses
        vm.prank(creator);
        string[] memory tags = new string[](1);
        tags[0] = "solidity";
        uint256 courseId2 = ipRegistry.registerCourse("QmTest456", tags, 500);

        _completeCourse(learner1);

        vm.startPrank(learner1);
        courseDirectory.enrollCourse(courseId2);
        courseDirectory.completeCourse(courseId2);

        // Mint 2 certificates
        certificateNFT.mintCertificate(courseId, 95, "ipfs://QmCert1");
        certificateNFT.mintCertificate(courseId2, 90, "ipfs://QmCert2");
        vm.stopPrank();

        uint256[] memory certs = certificateNFT.getLearnerCertificates(
            learner1
        );

        assertEq(certs.length, 2);
        assertEq(certs[0], 1);
        assertEq(certs[1], 2);
    }

    function testGetCertificateForCourse() public {
        _completeCourse(learner1);

        // No certificate yet
        assertEq(certificateNFT.getCertificateForCourse(learner1, courseId), 0);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        // Certificate issued
        assertEq(
            certificateNFT.getCertificateForCourse(learner1, courseId),
            tokenId
        );
    }

    function testGetTotalCertificates() public {
        assertEq(certificateNFT.getTotalCertificates(), 0);

        _completeCourse(learner1);
        _completeCourse(learner2);

        vm.prank(learner1);
        certificateNFT.mintCertificate(courseId, 95, "ipfs://QmCert1");

        assertEq(certificateNFT.getTotalCertificates(), 1);

        vm.prank(learner2);
        certificateNFT.mintCertificate(courseId, 90, "ipfs://QmCert2");

        assertEq(certificateNFT.getTotalCertificates(), 2);
    }

    function testSoulboundTransferBlocked() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        // Try to transfer
        vm.prank(learner1);
        vm.expectRevert(
            CertificateNFT.CertificateNFT__TransferNotAllowed.selector
        );
        certificateNFT.transferFrom(learner1, learner2, tokenId);
    }

    function testSoulboundSafeTransferBlocked() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        // Try safe transfer
        vm.prank(learner1);
        vm.expectRevert(
            CertificateNFT.CertificateNFT__TransferNotAllowed.selector
        );
        certificateNFT.safeTransferFrom(learner1, learner2, tokenId);
    }

    function testSoulboundApproveBlocked() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        // Approve should work (doesn't transfer)
        vm.prank(learner1);
        certificateNFT.approve(learner2, tokenId);

        // But transfer still blocked
        vm.prank(learner2);
        vm.expectRevert(
            CertificateNFT.CertificateNFT__TransferNotAllowed.selector
        );
        certificateNFT.transferFrom(learner1, learner2, tokenId);
    }

    function testMintingAllowed() public {
        _completeCourse(learner1);

        // Minting should work (from address(0) to learner1)
        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert123"
        );

        assertEq(certificateNFT.ownerOf(tokenId), learner1);
    }

    function testTokenURIStorage() public {
        _completeCourse(learner1);

        string memory uri = "ipfs://QmCustomCertificate123";

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(courseId, 95, uri);

        assertEq(certificateNFT.tokenURI(tokenId), uri);
    }

    function testSupportsInterface() public {
        // ERC721
        assertTrue(certificateNFT.supportsInterface(0x80ac58cd));

        // ERC721Metadata
        assertTrue(certificateNFT.supportsInterface(0x5b5e139f));

        // ERC165
        assertTrue(certificateNFT.supportsInterface(0x01ffc9a7));
    }

    function testMultipleLearnersSameCourse() public {
        _completeCourse(learner1);
        _completeCourse(learner2);

        vm.prank(learner1);
        uint256 tokenId1 = certificateNFT.mintCertificate(
            courseId,
            95,
            "ipfs://QmCert1"
        );

        vm.prank(learner2);
        uint256 tokenId2 = certificateNFT.mintCertificate(
            courseId,
            90,
            "ipfs://QmCert2"
        );

        assertEq(certificateNFT.ownerOf(tokenId1), learner1);
        assertEq(certificateNFT.ownerOf(tokenId2), learner2);

        assertEq(
            certificateNFT.getCertificateForCourse(learner1, courseId),
            tokenId1
        );
        assertEq(
            certificateNFT.getCertificateForCourse(learner2, courseId),
            tokenId2
        );
    }

    function testCertificateWithZeroScore() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            0,
            "ipfs://QmCert123"
        );

        CertificateNFT.Certificate memory cert = certificateNFT.getCertificate(
            tokenId
        );
        assertEq(cert.score, 0);
    }

    function testCertificateWithMaxScore() public {
        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            100,
            "ipfs://QmCert123"
        );

        CertificateNFT.Certificate memory cert = certificateNFT.getCertificate(
            tokenId
        );
        assertEq(cert.score, 100);
    }

    function testFuzzCertificateScore(uint8 score) public {
        vm.assume(score <= 100);

        _completeCourse(learner1);

        vm.prank(learner1);
        uint256 tokenId = certificateNFT.mintCertificate(
            courseId,
            score,
            "ipfs://QmCert123"
        );

        CertificateNFT.Certificate memory cert = certificateNFT.getCertificate(
            tokenId
        );
        assertEq(cert.score, score);
    }

    function testFuzzMultipleCertificates(uint8 numCourses) public {
        vm.assume(numCourses > 0 && numCourses <= 20);

        // Create and complete multiple courses
        for (uint256 i = 0; i < numCourses; i++) {
            vm.prank(creator);
            string[] memory tags = new string[](1);
            tags[0] = "test";
            uint256 newCourseId = ipRegistry.registerCourse(
                string(abi.encodePacked("QmTest", vm.toString(i))),
                tags,
                500
            );

            vm.startPrank(learner1);
            courseDirectory.enrollCourse(newCourseId);
            courseDirectory.completeCourse(newCourseId);
            certificateNFT.mintCertificate(newCourseId, 95, "ipfs://QmCert");
            vm.stopPrank();
        }

        uint256[] memory certs = certificateNFT.getLearnerCertificates(
            learner1
        );
        assertEq(certs.length, numCourses); // +1 for the initial course in setUp
    }

    function testNameAndSymbol() public {
        assertEq(certificateNFT.name(), "BLOCKEDLEARNING Certificate");
        assertEq(certificateNFT.symbol(), "BLCERT");
    }

    function testBalanceOf() public {
        assertEq(certificateNFT.balanceOf(learner1), 0);

        _completeCourse(learner1);

        vm.prank(learner1);
        certificateNFT.mintCertificate(courseId, 95, "ipfs://QmCert123");

        assertEq(certificateNFT.balanceOf(learner1), 1);
    }
}
