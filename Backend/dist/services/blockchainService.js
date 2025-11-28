import { JsonRpcProvider, Wallet, Contract, formatEther, parseEther } from 'ethers';
// Import ABIs
import IPRegistryABI from '../contracts/IPRegistry.abi.json' with { type: 'json' };
import CourseDirectoryABI from '../contracts/CourseDirectory.abi.json' with { type: 'json' };
import CertificateNFTABI from '../contracts/CertificateNFT.abi.json' with { type: 'json' };
import ReputationSystemABI from '../contracts/ReputationSystem.abi.json' with { type: 'json' };
import RoyaltyManagerABI from '../contracts/RoyaltyManager.abi.json' with { type: 'json' };
const getConfig = () => {
    const rpcUrl = process.env.RPC_URL || process.env.CAMP_TESTNET_RPC || 'http://127.0.0.1:8545';
    const privateKey = process.env.PRIVATE_KEY || '';
    const addresses = {
        ipRegistry: process.env.IP_REGISTRY_ADDRESS || '',
        courseDirectory: process.env.COURSE_DIRECTORY_ADDRESS || '',
        certificateNFT: process.env.CERTIFICATE_NFT_ADDRESS || '',
        reputationSystem: process.env.REPUTATION_SYSTEM_ADDRESS || '',
        royaltyManager: process.env.ROYALTY_MANAGER_ADDRESS || '',
    };
    return { rpcUrl, privateKey, addresses };
};
// ============ Provider & Contracts ============
let provider = null;
let signer = null;
let contracts = {
    ipRegistry: null,
    courseDirectory: null,
    certificateNFT: null,
    reputationSystem: null,
    royaltyManager: null,
};
const initializeContracts = () => {
    const config = getConfig();
    if (!provider) {
        provider = new JsonRpcProvider(config.rpcUrl);
    }
    if (!signer && config.privateKey) {
        signer = new Wallet(config.privateKey, provider);
    }
    const signerOrProvider = signer || provider;
    if (config.addresses.ipRegistry && !contracts.ipRegistry) {
        contracts.ipRegistry = new Contract(config.addresses.ipRegistry, IPRegistryABI, signerOrProvider);
    }
    if (config.addresses.courseDirectory && !contracts.courseDirectory) {
        contracts.courseDirectory = new Contract(config.addresses.courseDirectory, CourseDirectoryABI, signerOrProvider);
    }
    if (config.addresses.certificateNFT && !contracts.certificateNFT) {
        contracts.certificateNFT = new Contract(config.addresses.certificateNFT, CertificateNFTABI, signerOrProvider);
    }
    if (config.addresses.reputationSystem && !contracts.reputationSystem) {
        contracts.reputationSystem = new Contract(config.addresses.reputationSystem, ReputationSystemABI, signerOrProvider);
    }
    if (config.addresses.royaltyManager && !contracts.royaltyManager) {
        contracts.royaltyManager = new Contract(config.addresses.royaltyManager, RoyaltyManagerABI, signerOrProvider);
    }
    return contracts;
};
// ============ Helper Functions ============
const ensureContract = (contract, name) => {
    if (!contract) {
        throw new Error(`${name} contract not initialized. Check contract address in environment.`);
    }
    return contract;
};
const formatCourse = (rawCourse) => ({
    id: rawCourse.id,
    creator: rawCourse.creator,
    metadataHash: rawCourse.metadataHash,
    timestamp: rawCourse.timestamp,
    isActive: rawCourse.isActive,
    tags: rawCourse.tags,
    royaltyBps: rawCourse.royaltyBps,
});
const formatCourseStats = (rawStats) => ({
    enrollments: rawStats.enrollments,
    completions: rawStats.completions,
    totalRating: rawStats.totalRating,
    ratingCount: rawStats.ratingCount,
    views: rawStats.views,
});
const formatCertificate = (rawCert) => ({
    courseId: rawCert.courseId,
    learner: rawCert.learner,
    completionDate: rawCert.completionDate,
    score: rawCert.score,
    metadataUri: rawCert.metadataUri,
});
const formatUserProfile = (rawProfile) => ({
    totalXP: rawProfile.totalXP,
    level: rawProfile.level,
    coursesCompleted: rawProfile.coursesCompleted,
    coursesCreated: rawProfile.coursesCreated,
    totalRatingsGiven: rawProfile.totalRatingsGiven,
    streak: rawProfile.streak,
    lastActivityDate: rawProfile.lastActivityDate,
});
const formatBadge = (rawBadge) => ({
    name: rawBadge.name,
    description: rawBadge.description,
    imageUri: rawBadge.imageUri,
    requiredXP: rawBadge.requiredXP,
    exists: rawBadge.exists,
});
// ============ IPRegistry Functions ============
export const ipRegistryService = {
    /**
     * Register a new course on-chain
     */
    registerCourse: async (metadataHash, tags, royaltyBps) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        const tx = await contract.registerCourse(metadataHash, tags, royaltyBps);
        const receipt = await tx.wait();
        // Parse the CourseRegistered event to get the courseId
        const event = receipt.logs.find((log) => {
            try {
                const parsed = contract.interface.parseLog(log);
                return parsed?.name === 'CourseRegistered';
            }
            catch {
                return false;
            }
        });
        let courseId = BigInt(0);
        if (event) {
            const parsed = contract.interface.parseLog(event);
            courseId = parsed?.args?.ipId || BigInt(0);
        }
        return { txHash: receipt.hash, courseId };
    },
    /**
     * Get course details by ID
     */
    getCourse: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        const rawCourse = await contract.getCourse(courseId);
        return formatCourse(rawCourse);
    },
    /**
     * Get all course IDs by a creator
     */
    getCreatorCourses: async (creatorAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        return await contract.getCreatorCourses(creatorAddress);
    },
    /**
     * Get course ID by metadata hash
     */
    getCourseByMetadataHash: async (metadataHash) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        return await contract.getCourseByMetadataHash(metadataHash);
    },
    /**
     * Get total number of courses
     */
    getTotalCourses: async () => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        return await contract.getTotalCourses();
    },
    /**
     * Check if a course is active
     */
    isCourseActive: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        return await contract.isCourseActive(courseId);
    },
    /**
     * Update course metadata (creator only)
     */
    updateCourseMetadata: async (courseId, newMetadataHash) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        const tx = await contract.updateCourseMetadata(courseId, newMetadataHash);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Deactivate a course (creator only)
     */
    deactivateCourse: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');
        const tx = await contract.deactivateCourse(courseId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
};
// ============ CourseDirectory Functions ============
export const courseDirectoryService = {
    /**
     * Enroll in a course
     */
    enrollCourse: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        const tx = await contract.enrollCourse(courseId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Mark course as completed
     */
    completeCourse: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        const tx = await contract.completeCourse(courseId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Rate a course (1-5 stars)
     */
    rateCourse: async (courseId, rating) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        const tx = await contract.rateCourse(courseId, rating);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Record a course view
     */
    viewCourse: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        const tx = await contract.viewCourse(courseId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Get course statistics
     */
    getCourseStats: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        const rawStats = await contract.getCourseStats(courseId);
        return formatCourseStats(rawStats);
    },
    /**
     * Get average rating for a course (scaled by 100)
     */
    getAverageRating: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        return await contract.getAverageRating(courseId);
    },
    /**
     * Check if user is enrolled in a course
     */
    isEnrolled: async (courseId, learnerAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        return await contract.isEnrolled(courseId, learnerAddress);
    },
    /**
     * Check if user has completed a course
     */
    hasCompleted: async (courseId, learnerAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        return await contract.hasCompleted(courseId, learnerAddress);
    },
    /**
     * Get completion rate (scaled by 10000)
     */
    getCompletionRate: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');
        return await contract.getCompletionRate(courseId);
    },
};
// ============ CertificateNFT Functions ============
export const certificateService = {
    /**
     * Mint a certificate for course completion
     */
    mintCertificate: async (courseId, score, metadataUri) => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        const tx = await contract.mintCertificate(courseId, score, metadataUri);
        const receipt = await tx.wait();
        // Parse the CertificateIssued event to get the tokenId
        const event = receipt.logs.find((log) => {
            try {
                const parsed = contract.interface.parseLog(log);
                return parsed?.name === 'CertificateIssued';
            }
            catch {
                return false;
            }
        });
        let tokenId = BigInt(0);
        if (event) {
            const parsed = contract.interface.parseLog(event);
            tokenId = parsed?.args?.tokenId || BigInt(0);
        }
        return { txHash: receipt.hash, tokenId };
    },
    /**
     * Get certificate details by token ID
     */
    getCertificate: async (tokenId) => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        const rawCert = await contract.getCertificate(tokenId);
        return formatCertificate(rawCert);
    },
    /**
     * Get all certificate token IDs for a learner
     */
    getLearnerCertificates: async (learnerAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        return await contract.getLearnerCertificates(learnerAddress);
    },
    /**
     * Get certificate token ID for a specific course and learner
     */
    getCertificateForCourse: async (learnerAddress, courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        return await contract.getCertificateForCourse(learnerAddress, courseId);
    },
    /**
     * Get total certificates issued
     */
    getTotalCertificates: async () => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        return await contract.getTotalCertificates();
    },
    /**
     * Get certificate token URI
     */
    getTokenURI: async (tokenId) => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        return await contract.tokenURI(tokenId);
    },
    /**
     * Get certificate owner
     */
    getOwner: async (tokenId) => {
        initializeContracts();
        const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');
        return await contract.ownerOf(tokenId);
    },
};
// ============ ReputationSystem Functions ============
export const reputationService = {
    /**
     * Award XP for completing a course
     */
    awardCourseCompletionXP: async (userAddress, courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        const tx = await contract.awardCourseCompletionXP(userAddress, courseId);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Award XP for creating a course
     */
    awardCourseCreationXP: async (userAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        const tx = await contract.awardCourseCreationXP(userAddress);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Award XP for rating a course
     */
    awardRatingXP: async (userAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        const tx = await contract.awardRatingXP(userAddress);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Get user profile (XP, level, stats)
     */
    getUserProfile: async (userAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        const rawProfile = await contract.getUserProfile(userAddress);
        return formatUserProfile(rawProfile);
    },
    /**
     * Get all badge IDs earned by user
     */
    getUserBadges: async (userAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        return await contract.getUserBadges(userAddress);
    },
    /**
     * Get badge details by ID
     */
    getBadge: async (badgeId) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        const rawBadge = await contract.getBadge(badgeId);
        return formatBadge(rawBadge);
    },
    /**
     * Check if user has a specific badge
     */
    userHasBadge: async (userAddress, badgeId) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        return await contract.userHasBadge(userAddress, badgeId);
    },
    /**
     * Get XP needed for next level
     */
    getXPToNextLevel: async (userAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        return await contract.getXPToNextLevel(userAddress);
    },
    /**
     * Get total badge count
     */
    getBadgeCount: async () => {
        initializeContracts();
        const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');
        return await contract.badgeCount();
    },
};
// ============ RoyaltyManager Functions ============
export const royaltyService = {
    /**
     * Purchase a course
     */
    purchaseCourse: async (courseId, valueInWei) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        const tx = await contract.purchaseCourse(courseId, { value: valueInWei });
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Set course price (creator only)
     */
    setCoursePrice: async (courseId, priceInWei) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        const tx = await contract.setCoursePrice(courseId, priceInWei);
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Withdraw pending earnings (creator)
     */
    withdrawEarnings: async () => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        const tx = await contract.withdrawEarnings();
        const receipt = await tx.wait();
        return { txHash: receipt.hash };
    },
    /**
     * Get course price
     */
    getCoursePrice: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        return await contract.getCoursePrice(courseId);
    },
    /**
     * Check if user has purchased a course
     */
    hasUserPurchased: async (courseId, buyerAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        return await contract.hasUserPurchased(courseId, buyerAddress);
    },
    /**
     * Get pending withdrawals for creator
     */
    getPendingWithdrawals: async (creatorAddress) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        return await contract.getPendingWithdrawals(creatorAddress);
    },
    /**
     * Get total revenue for a course
     */
    getCourseRevenue: async (courseId) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        return await contract.courseRevenue(courseId);
    },
    /**
     * Calculate fees for a given price
     */
    calculateFees: async (priceInWei) => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        const [platformFee, creatorAmount] = await contract.calculateFees(priceInWei);
        return { platformFee, creatorAmount };
    },
    /**
     * Get platform fee in basis points
     */
    getPlatformFeeBps: async () => {
        initializeContracts();
        const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');
        return await contract.platformFeeBps();
    },
};
// ============ Utility Functions ============
export const blockchainUtils = {
    /**
     * Convert ETH to Wei
     */
    toWei: (ethAmount) => parseEther(ethAmount),
    /**
     * Convert Wei to ETH
     */
    fromWei: (weiAmount) => formatEther(weiAmount),
    /**
     * Check if blockchain service is configured
     */
    isConfigured: () => {
        const config = getConfig();
        return !!(config.addresses.ipRegistry || config.addresses.courseDirectory);
    },
    /**
     * Get current block number
     */
    getBlockNumber: async () => {
        initializeContracts();
        if (!provider)
            throw new Error('Provider not initialized');
        return await provider.getBlockNumber();
    },
    /**
     * Get wallet balance
     */
    getBalance: async (address) => {
        initializeContracts();
        if (!provider)
            throw new Error('Provider not initialized');
        const balance = await provider.getBalance(address);
        return formatEther(balance);
    },
};
// ============ Combined Service Export ============
export const blockchainService = {
    ipRegistry: ipRegistryService,
    courseDirectory: courseDirectoryService,
    certificates: certificateService,
    reputation: reputationService,
    royalty: royaltyService,
    utils: blockchainUtils,
};
export default blockchainService;
//# sourceMappingURL=blockchainService.js.map