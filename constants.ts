
import { Task, AppUsage, DailyStats, UserGoal, Badge, LinkedAccount } from './types';

const getRelativeDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Calculus Assignment', category: 'Study', priority: 'High', completed: false, dueDate: getRelativeDate(0), durationMinutes: 60 },
  { id: '2', title: 'Read History Chapter 4', category: 'Study', priority: 'Medium', completed: false, dueDate: getRelativeDate(1), durationMinutes: 45 },
  { id: '3', title: 'Gym Workout', category: 'Health', priority: 'Medium', completed: true, dueDate: getRelativeDate(0), durationMinutes: 60 },
  { id: '4', title: 'Group Project UI Design', category: 'Project', priority: 'High', completed: false, dueDate: getRelativeDate(3), durationMinutes: 120 },
  { id: '5', title: 'Return Library Book', category: 'Personal', priority: 'Low', completed: false, dueDate: getRelativeDate(-1), durationMinutes: 15 },
];

export const MOCK_USAGE: AppUsage[] = [
  { name: 'Instagram', minutes: 45, limit: 30, icon: 'camera', color: '#E1306C' },
  { name: 'TikTok', minutes: 80, limit: 60, icon: 'music', color: '#000000' },
  { name: 'YouTube', minutes: 30, limit: 90, icon: 'video', color: '#FF0000' },
  { name: 'WhatsApp', minutes: 15, limit: 45, icon: 'message-circle', color: '#25D366' },
];

export const WEEKLY_STATS: DailyStats[] = [
  { date: 'Mon', studyMinutes: 120, socialMinutes: 150, focusScore: 45, breakdown: { studyPoints: 20, taskPoints: 15, controlPoints: 10, penaltyPoints: 5 } },
  { date: 'Tue', studyMinutes: 180, socialMinutes: 90, focusScore: 70, breakdown: { studyPoints: 35, taskPoints: 25, controlPoints: 10, penaltyPoints: 0 } },
  { date: 'Wed', studyMinutes: 240, socialMinutes: 60, focusScore: 85, breakdown: { studyPoints: 45, taskPoints: 30, controlPoints: 10, penaltyPoints: 0 } },
  { date: 'Thu', studyMinutes: 150, socialMinutes: 120, focusScore: 60, breakdown: { studyPoints: 30, taskPoints: 20, controlPoints: 10, penaltyPoints: 0 } },
  { date: 'Fri', studyMinutes: 200, socialMinutes: 100, focusScore: 65, breakdown: { studyPoints: 35, taskPoints: 20, controlPoints: 10, penaltyPoints: 0 } },
  { date: 'Sat', studyMinutes: 90, socialMinutes: 240, focusScore: 30, breakdown: { studyPoints: 15, taskPoints: 10, controlPoints: 5, penaltyPoints: 15 } },
  { date: 'Sun', studyMinutes: 120, socialMinutes: 180, focusScore: 40, breakdown: { studyPoints: 20, taskPoints: 10, controlPoints: 10, penaltyPoints: 5 } },
];

export const INITIAL_GOALS: UserGoal[] = [
  { id: '1', title: 'Study Hours', target: 20, current: 14, unit: 'hrs' },
  { id: '2', title: 'No Social Media', target: 5, current: 3, unit: 'days streak' },
];

export const BADGES: Badge[] = [
  { id: '1', name: 'Early Bird', icon: '🌅', description: 'Start a focus session before 7 AM', unlocked: true, color: 'bg-orange-100' },
  { id: '2', name: 'Deep Diver', icon: '🌊', description: 'Complete a 2-hour focus session', unlocked: true, color: 'bg-blue-100' },
  { id: '3', name: 'Pomo King', icon: '🍅', description: 'Complete 10 Pomodoros in a week', unlocked: false, color: 'bg-red-100' },
  { id: '4', name: 'Social Hermit', icon: '🐌', description: 'Zero social media for 24 hours', unlocked: true, color: 'bg-green-100' },
  { id: '5', name: 'Task Slayer', icon: '⚔️', description: 'Finish 10 tasks in one day', unlocked: false, color: 'bg-purple-100' },
  { id: '6', name: 'Zen Master', icon: '🧘', description: 'Use focus sounds for 5 hours', unlocked: false, color: 'bg-indigo-100' },
];

export const LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: '1', name: 'Jordan S.', avatar: 'https://i.pravatar.cc/150?u=jordan' },
  { id: '2', name: 'Casey L.', avatar: 'https://i.pravatar.cc/150?u=casey' },
  { id: '3', name: 'Milo H.', avatar: 'https://i.pravatar.cc/150?u=milo' },
];

export const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Your future is created by what you do today, not tomorrow.",
];
