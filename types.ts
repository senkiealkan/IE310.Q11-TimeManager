
export interface Task {
  id: string;
  title: string;
  category: 'Study' | 'Personal' | 'Project' | 'Health';
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string; // ISO Date String (YYYY-MM-DD)
  durationMinutes: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  color: string;
}

export interface LinkedAccount {
  id: string;
  name: string;
  avatar: string;
}

export interface DailyStats {
  date: string;
  studyMinutes: number;
  socialMinutes: number;
  focusScore: number;
  breakdown?: {
    studyPoints: number;
    taskPoints: number;
    controlPoints: number;
    penaltyPoints: number;
  };
}

export interface AppUsage {
  name: string;
  minutes: number;
  limit: number;
  icon: string;
  color: string;
}

export type UserMood = 'Focus' | 'Tired' | 'Stressed' | 'Energized' | 'Relaxed';

export interface DailyChallenge {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
}

export enum Tab {
  HOME = 'HOME',
  TASKS = 'TASKS',
  FOCUS = 'FOCUS',
  STATS = 'STATS',
  PROFILE = 'PROFILE'
}

export interface UserGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}
