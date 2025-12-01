export interface User {
  wallet: string;
  username?: string;
  email?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  creator: string;
  tags: string[];
  level: string;
}

export interface UserProgress {
  completedModules: string[];
  xp: number;
  badges: string[];
}

export interface MentorResponse {
  message: string;
  recommendedNextTopic?: string;
}
