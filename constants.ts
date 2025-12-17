
import { Task, AppUsage, DailyStats, UserGoal } from './types';

// Helper to get ISO date string relative to today
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
  { id: '5', title: 'Return Library Book', category: 'Personal', priority: 'Low', completed: false, dueDate: getRelativeDate(-1), durationMinutes: 15 }, // Overdue Example
];

export const MOCK_USAGE: AppUsage[] = [
  { name: 'Instagram', minutes: 45, limit: 30, icon: 'camera', color: '#E1306C' },
  { name: 'TikTok', minutes: 80, limit: 60, icon: 'music', color: '#000000' },
  { name: 'YouTube', minutes: 30, limit: 90, icon: 'video', color: '#FF0000' },
  { name: 'WhatsApp', minutes: 15, limit: 45, icon: 'message-circle', color: '#25D366' },
];

export const WEEKLY_STATS: DailyStats[] = [
  { date: 'Mon', studyMinutes: 120, socialMinutes: 150, focusScore: 45 },
  { date: 'Tue', studyMinutes: 180, socialMinutes: 90, focusScore: 70 },
  { date: 'Wed', studyMinutes: 240, socialMinutes: 60, focusScore: 85 },
  { date: 'Thu', studyMinutes: 150, socialMinutes: 120, focusScore: 60 },
  { date: 'Fri', studyMinutes: 200, socialMinutes: 100, focusScore: 65 },
  { date: 'Sat', studyMinutes: 90, socialMinutes: 240, focusScore: 30 },
  { date: 'Sun', studyMinutes: 120, socialMinutes: 180, focusScore: 40 },
];

export const INITIAL_GOALS: UserGoal[] = [
  { id: '1', title: 'Study Hours', target: 20, current: 14, unit: 'hrs' },
  { id: '2', title: 'No Social Media', target: 5, current: 3, unit: 'days streak' },
];

export const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Your future is created by what you do today, not tomorrow.",
];
