
export interface Task {
  id: string;
  title: string;
  category: 'Study' | 'Personal' | 'Project' | 'Health';
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  dueDate: string; // ISO Date String (YYYY-MM-DD)
  durationMinutes: number;
}

export interface DailyStats {
  date: string;
  studyMinutes: number;
  socialMinutes: number;
  focusScore: number; // 0-100
}

export interface AppUsage {
  name: string;
  minutes: number;
  limit: number; // Daily limit in minutes
  icon: string;
  color: string;
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
