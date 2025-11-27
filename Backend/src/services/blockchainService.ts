import { ethers, JsonRpcProvider, Wallet, Contract, formatEther, parseEther } from 'ethers';

// Import ABIs
import IPRegistryABI from '../contracts/IPRegistry.abi.json' with { type: 'json' };
import CourseDirectoryABI from '../contracts/CourseDirectory.abi.json' with { type: 'json' };
import CertificateNFTABI from '../contracts/CertificateNFT.abi.json' with { type: 'json' };
import ReputationSystemABI from '../contracts/ReputationSystem.abi.json' with { type: 'json' };
import RoyaltyManagerABI from '../contracts/RoyaltyManager.abi.json' with { type: 'json' };

// ============ Types ============

export interface Course {
  id: bigint;
  creator: string;
  metadataHash: string;
  timestamp: bigint;
  isActive: boolean;
  tags: string[];
  royaltyBps: bigint;
}

export interface CourseStats {
  enrollments: bigint;
  completions: bigint;
  totalRating: bigint;
  ratingCount: bigint;
  views: bigint;
}

export interface Certificate {
  courseId: bigint;
  learner: string;
  completionDate: bigint;
  score: bigint;
  metadataUri: string;
}

export interface UserProfile {
  totalXP: bigint;
  level: bigint;
  coursesCompleted: bigint;
  coursesCreated: bigint;
  totalRatingsGiven: bigint;
  streak: bigint;
  lastActivityDate: bigint;
}

export interface Badge {
  name: string;
  description: string;
  imageUri: string;
  requiredXP: bigint;
  exists: boolean;
}

// ============ Configuration ============

interface ContractAddresses {
  ipRegistry: string;
  courseDirectory: string;
  certificateNFT: string;
  reputationSystem: string;
  royaltyManager: string;
}

const getConfig = () => {
  const rpcUrl = process.env.RPC_URL || process.env.CAMP_TESTNET_RPC || 'http://127.0.0.1:8545';
  const privateKey = process.env.PRIVATE_KEY || '';
  
  const addresses: ContractAddresses = {
    ipRegistry: process.env.IP_REGISTRY_ADDRESS || '',
    courseDirectory: process.env.COURSE_DIRECTORY_ADDRESS || '',
    certificateNFT: process.env.CERTIFICATE_NFT_ADDRESS || '',
    reputationSystem: process.env.REPUTATION_SYSTEM_ADDRESS || '',
    royaltyManager: process.env.ROYALTY_MANAGER_ADDRESS || '',
  };

  return { rpcUrl, privateKey, addresses };
};

// ============ Provider & Contracts ============

let provider: JsonRpcProvider | null = null;
let signer: Wallet | null = null;
let contracts: {
  ipRegistry: Contract | null;
  courseDirectory: Contract | null;
  certificateNFT: Contract | null;
  reputationSystem: Contract | null;
  royaltyManager: Contract | null;
} = {
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

const ensureContract = (contract: Contract | null, name: string): Contract => {
  if (!contract) {
    throw new Error(`${name} contract not initialized. Check contract address in environment.`);
  }
  return contract;
};

const formatCourse = (rawCourse: any): Course => ({
  id: rawCourse.id,
  creator: rawCourse.creator,
  metadataHash: rawCourse.metadataHash,
  timestamp: rawCourse.timestamp,
  isActive: rawCourse.isActive,
  tags: rawCourse.tags,
  royaltyBps: rawCourse.royaltyBps,
});

const formatCourseStats = (rawStats: any): CourseStats => ({
  enrollments: rawStats.enrollments,
  completions: rawStats.completions,
  totalRating: rawStats.totalRating,
  ratingCount: rawStats.ratingCount,
  views: rawStats.views,
});

const formatCertificate = (rawCert: any): Certificate => ({
  courseId: rawCert.courseId,
  learner: rawCert.learner,
  completionDate: rawCert.completionDate,
  score: rawCert.score,
  metadataUri: rawCert.metadataUri,
});

const formatUserProfile = (rawProfile: any): UserProfile => ({
  totalXP: rawProfile.totalXP,
  level: rawProfile.level,
  coursesCompleted: rawProfile.coursesCompleted,
  coursesCreated: rawProfile.coursesCreated,
  totalRatingsGiven: rawProfile.totalRatingsGiven,
  streak: rawProfile.streak,
  lastActivityDate: rawProfile.lastActivityDate,
});

const formatBadge = (rawBadge: any): Badge => ({
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
  registerCourse: async (metadataHash: string, tags: string[], royaltyBps: number): Promise<{ txHash: string; courseId: bigint }> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    const tx = await contract.registerCourse(metadataHash, tags, royaltyBps);
    const receipt = await tx.wait();

    // Parse the CourseRegistered event to get the courseId
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'CourseRegistered';
      } catch {
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
  getCourse: async (courseId: number): Promise<Course> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    const rawCourse = await contract.getCourse(courseId);
    return formatCourse(rawCourse);
  },

  /**
   * Get all course IDs by a creator
   */
  getCreatorCourses: async (creatorAddress: string): Promise<bigint[]> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    return await contract.getCreatorCourses(creatorAddress);
  },

  /**
   * Get course ID by metadata hash
   */
  getCourseByMetadataHash: async (metadataHash: string): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    return await contract.getCourseByMetadataHash(metadataHash);
  },

  /**
   * Get total number of courses
   */
  getTotalCourses: async (): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    return await contract.getTotalCourses();
  },

  /**
   * Check if a course is active
   */
  isCourseActive: async (courseId: number): Promise<boolean> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    return await contract.isCourseActive(courseId);
  },

  /**
   * Update course metadata (creator only)
   */
  updateCourseMetadata: async (courseId: number, newMetadataHash: string): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.ipRegistry, 'IPRegistry');

    const tx = await contract.updateCourseMetadata(courseId, newMetadataHash);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Deactivate a course (creator only)
   */
  deactivateCourse: async (courseId: number): Promise<{ txHash: string }> => {
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
  enrollCourse: async (courseId: number): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    const tx = await contract.enrollCourse(courseId);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Mark course as completed
   */
  completeCourse: async (courseId: number): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    const tx = await contract.completeCourse(courseId);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Rate a course (1-5 stars)
   */
  rateCourse: async (courseId: number, rating: number): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    const tx = await contract.rateCourse(courseId, rating);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Record a course view
   */
  viewCourse: async (courseId: number): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    const tx = await contract.viewCourse(courseId);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Get course statistics
   */
  getCourseStats: async (courseId: number): Promise<CourseStats> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    const rawStats = await contract.getCourseStats(courseId);
    return formatCourseStats(rawStats);
  },

  /**
   * Get average rating for a course (scaled by 100)
   */
  getAverageRating: async (courseId: number): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    return await contract.getAverageRating(courseId);
  },

  /**
   * Check if user is enrolled in a course
   */
  isEnrolled: async (courseId: number, learnerAddress: string): Promise<boolean> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    return await contract.isEnrolled(courseId, learnerAddress);
  },

  /**
   * Check if user has completed a course
   */
  hasCompleted: async (courseId: number, learnerAddress: string): Promise<boolean> => {
    initializeContracts();
    const contract = ensureContract(contracts.courseDirectory, 'CourseDirectory');

    return await contract.hasCompleted(courseId, learnerAddress);
  },

  /**
   * Get completion rate (scaled by 10000)
   */
  getCompletionRate: async (courseId: number): Promise<bigint> => {
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
  mintCertificate: async (courseId: number, score: number, metadataUri: string): Promise<{ txHash: string; tokenId: bigint }> => {
    initializeContracts();
    const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');

    const tx = await contract.mintCertificate(courseId, score, metadataUri);
    const receipt = await tx.wait();

    // Parse the CertificateIssued event to get the tokenId
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'CertificateIssued';
      } catch {
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
  getCertificate: async (tokenId: number): Promise<Certificate> => {
    initializeContracts();
    const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');

    const rawCert = await contract.getCertificate(tokenId);
    return formatCertificate(rawCert);
  },

  /**
   * Get all certificate token IDs for a learner
   */
  getLearnerCertificates: async (learnerAddress: string): Promise<bigint[]> => {
    initializeContracts();
    const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');

    return await contract.getLearnerCertificates(learnerAddress);
  },

  /**
   * Get certificate token ID for a specific course and learner
   */
  getCertificateForCourse: async (learnerAddress: string, courseId: number): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');

    return await contract.getCertificateForCourse(learnerAddress, courseId);
  },

  /**
   * Get total certificates issued
   */
  getTotalCertificates: async (): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');

    return await contract.getTotalCertificates();
  },

  /**
   * Get certificate token URI
   */
  getTokenURI: async (tokenId: number): Promise<string> => {
    initializeContracts();
    const contract = ensureContract(contracts.certificateNFT, 'CertificateNFT');

    return await contract.tokenURI(tokenId);
  },

  /**
   * Get certificate owner
   */
  getOwner: async (tokenId: number): Promise<string> => {
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
  awardCourseCompletionXP: async (userAddress: string, courseId: number): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    const tx = await contract.awardCourseCompletionXP(userAddress, courseId);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Award XP for creating a course
   */
  awardCourseCreationXP: async (userAddress: string): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    const tx = await contract.awardCourseCreationXP(userAddress);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Award XP for rating a course
   */
  awardRatingXP: async (userAddress: string): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    const tx = await contract.awardRatingXP(userAddress);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Get user profile (XP, level, stats)
   */
  getUserProfile: async (userAddress: string): Promise<UserProfile> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    const rawProfile = await contract.getUserProfile(userAddress);
    return formatUserProfile(rawProfile);
  },

  /**
   * Get all badge IDs earned by user
   */
  getUserBadges: async (userAddress: string): Promise<bigint[]> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    return await contract.getUserBadges(userAddress);
  },

  /**
   * Get badge details by ID
   */
  getBadge: async (badgeId: number): Promise<Badge> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    const rawBadge = await contract.getBadge(badgeId);
    return formatBadge(rawBadge);
  },

  /**
   * Check if user has a specific badge
   */
  userHasBadge: async (userAddress: string, badgeId: number): Promise<boolean> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    return await contract.userHasBadge(userAddress, badgeId);
  },

  /**
   * Get XP needed for next level
   */
  getXPToNextLevel: async (userAddress: string): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.reputationSystem, 'ReputationSystem');

    return await contract.getXPToNextLevel(userAddress);
  },

  /**
   * Get total badge count
   */
  getBadgeCount: async (): Promise<bigint> => {
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
  purchaseCourse: async (courseId: number, valueInWei: bigint): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    const tx = await contract.purchaseCourse(courseId, { value: valueInWei });
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Set course price (creator only)
   */
  setCoursePrice: async (courseId: number, priceInWei: bigint): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    const tx = await contract.setCoursePrice(courseId, priceInWei);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Withdraw pending earnings (creator)
   */
  withdrawEarnings: async (): Promise<{ txHash: string }> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    const tx = await contract.withdrawEarnings();
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  },

  /**
   * Get course price
   */
  getCoursePrice: async (courseId: number): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    return await contract.getCoursePrice(courseId);
  },

  /**
   * Check if user has purchased a course
   */
  hasUserPurchased: async (courseId: number, buyerAddress: string): Promise<boolean> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    return await contract.hasUserPurchased(courseId, buyerAddress);
  },

  /**
   * Get pending withdrawals for creator
   */
  getPendingWithdrawals: async (creatorAddress: string): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    return await contract.getPendingWithdrawals(creatorAddress);
  },

  /**
   * Get total revenue for a course
   */
  getCourseRevenue: async (courseId: number): Promise<bigint> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    return await contract.courseRevenue(courseId);
  },

  /**
   * Calculate fees for a given price
   */
  calculateFees: async (priceInWei: bigint): Promise<{ platformFee: bigint; creatorAmount: bigint }> => {
    initializeContracts();
    const contract = ensureContract(contracts.royaltyManager, 'RoyaltyManager');

    const [platformFee, creatorAmount] = await contract.calculateFees(priceInWei);
    return { platformFee, creatorAmount };
  },

  /**
   * Get platform fee in basis points
   */
  getPlatformFeeBps: async (): Promise<bigint> => {
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
  toWei: (ethAmount: string): bigint => parseEther(ethAmount),

  /**
   * Convert Wei to ETH
   */
  fromWei: (weiAmount: bigint): string => formatEther(weiAmount),

  /**
   * Check if blockchain service is configured
   */
  isConfigured: (): boolean => {
    const config = getConfig();
    return !!(config.addresses.ipRegistry || config.addresses.courseDirectory);
  },

  /**
   * Get current block number
   */
  getBlockNumber: async (): Promise<number> => {
    initializeContracts();
    if (!provider) throw new Error('Provider not initialized');
    return await provider.getBlockNumber();
  },

  /**
   * Get wallet balance
   */
  getBalance: async (address: string): Promise<string> => {
    initializeContracts();
    if (!provider) throw new Error('Provider not initialized');
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
