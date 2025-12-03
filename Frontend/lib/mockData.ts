import { User } from "@/store/slices/userSlice";
import { Course } from "@/store/slices/coursesSlice";
import { AdminStats } from "@/store/slices/adminSlice";

export const MOCK_USERS: User[] = [
  // Users
  {
    id: "u1",
    walletAddress: "0xUser1...0001",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "u2",
    walletAddress: "0xUser2...0002",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "u3",
    walletAddress: "0xUser3...0003",
    role: "user",
    createdAt: "2024-01-03T00:00:00Z",
  },
  // Creators
  {
    id: "c1",
    walletAddress: "0xCreator1...0001",
    role: "creator",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "c2",
    walletAddress: "0xCreator2...0002",
    role: "creator",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "c3",
    walletAddress: "0xCreator3...0003",
    role: "creator",
    createdAt: "2024-01-03T00:00:00Z",
  },
  // Admins
  {
    id: "a1",
    walletAddress: "0xAdmin1...0001",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "a2",
    walletAddress: "0xAdmin2...0002",
    role: "admin",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "a3",
    walletAddress: "0xAdmin3...0003",
    role: "admin",
    createdAt: "2024-01-03T00:00:00Z",
  },
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course1",
    title: "Intro to Solana Development",
    description: "Learn the basics of Solana and Rust programming.",
    creator: "0xCreator1...0001",
    price: "0.5 SOL",
    modules: [
      {
        id: "m1-1",
        title: "Blockchain Basics",
        duration: "10:00",
        content: "Understanding distributed ledgers.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        id: "m1-2",
        title: "Rust for Solana",
        duration: "15:30",
        content: "Introduction to Rust syntax.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      },
      {
        id: "m1-3",
        title: "Your First Program",
        duration: "20:00",
        content: "Hello World on Solana.",
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
    ],
    isPublished: true,
    contractAddress: "0xCourseContract1...",
  },
  {
    id: "course2",
    title: "Advanced Smart Contracts",
    description: "Master Anchor framework and security patterns.",
    creator: "0xCreator1...0001",
    price: "1.2 SOL",
    modules: [
      {
        id: "m2-1",
        title: "Anchor Framework Deep Dive",
        duration: "25:00",
        content: "Structuring Anchor programs.",
      },
      {
        id: "m2-2",
        title: "PDA Management",
        duration: "18:45",
        content: "Program Derived Addresses explained.",
      },
      {
        id: "m2-3",
        title: "Security Best Practices",
        duration: "30:00",
        content: "Avoiding common pitfalls.",
      },
    ],
    isPublished: true,
    contractAddress: "0xCourseContract2...",
  },
  {
    id: "course3",
    title: "DeFi Economics 101",
    description: "Understanding tokenomics and liquidity pools.",
    creator: "0xCreator2...0002",
    price: "0.8 SOL",
    modules: [
      {
        id: "m3-1",
        title: "Tokenomics 101",
        duration: "12:00",
        content: "Supply, demand, and utility.",
      },
      {
        id: "m3-2",
        title: "Liquidity Pools",
        duration: "22:15",
        content: "How AMMs work.",
      },
    ],
    isPublished: true,
    contractAddress: "0xCourseContract3...",
  },
  {
    id: "course4",
    title: "NFT Marketplace Build",
    description: "Build a full-stack NFT marketplace from scratch.",
    creator: "0xCreator3...0003",
    price: "1.5 SOL",
    modules: [
      {
        id: "m4-1",
        title: "Metaplex Standard",
        duration: "14:20",
        content: "Understanding NFT metadata.",
      },
      {
        id: "m4-2",
        title: "Marketplace Logic",
        duration: "28:00",
        content: "Listing and buying logic.",
      },
    ],
    isPublished: false,
  },
];

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 15420,
  totalCourses: 345,
  totalVolume: "45,230 SOL",
};

export const MOCK_USER_PROGRESS = [
  {
    courseId: "course1",
    completedModules: ["m1-1", "m1-2"],
    progressPercentage: 66,
  },
  {
    courseId: "course2",
    completedModules: ["m2-1"],
    progressPercentage: 33,
  },
];
