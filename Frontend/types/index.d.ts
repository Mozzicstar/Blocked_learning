interface User {
  wallet: string;
  username?: string;
  email?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  creator: string;
  tags: string[];
  level: string;
}

interface UserProgress {
  completedModules: string[];
  xp: number;
  badges: string[];
}

interface MentorResponse {
  message: string;
  recommendedNextTopic?: string;
}
