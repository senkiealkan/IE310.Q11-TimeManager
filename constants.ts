
import { Task, AppUsage, DailyStats, UserGoal, Badge } from './types';

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
  { id: '1', name: 'Mầm Non Tập Trung', icon: '🌱', description: 'Hoàn thành phiên Pomodoro đầu tiên.', unlocked: true, color: 'bg-emerald-100' },
  { id: '2', name: 'Chuỗi Bất Bại', icon: '🔥', description: 'Duy trì liên tiếp 5 phiên Pomodoro trong một ngày.', unlocked: true, color: 'bg-orange-100' },
  { id: '3', name: 'Bậc Thầy Thiền Định', icon: '🧘', description: 'Hoàn thành 4 phiên Pomodoro mà không hề chạm vào điện thoại/thoát app.', unlocked: false, color: 'bg-violet-100' },
  { id: '4', name: 'Cú Đêm Miệt Mài', icon: '🦉', description: 'Hoàn thành ít nhất 2 phiên Pomodoro sau 22h đêm.', unlocked: true, color: 'bg-indigo-100' },
  { id: '5', name: 'Kỷ Lục Gia', icon: '🏆', description: 'Đạt tổng cộng 100/500/1000 giờ tập trung (Đồng/Bạc/Vàng).', unlocked: false, color: 'bg-amber-100' },
  { id: '6', name: 'Kẻ Vô Hình', icon: '🚫', description: 'Không mở bất kỳ ứng dụng MXH nào trong suốt 24 giờ.', unlocked: true, color: 'bg-slate-100' },
  { id: '7', name: 'Thợ Săn Thời Gian', icon: '✂️', description: 'Giảm được 30% thời gian dùng MXH so với trung bình tuần trước.', unlocked: false, color: 'bg-blue-100' },
  { id: '8', name: 'Đường Dốc An Toàn', icon: '📉', description: 'Duy trì thời gian dùng MXH dưới ngưỡng mục tiêu trong 7 ngày liên tiếp.', unlocked: false, color: 'bg-rose-100' },
  { id: '9', name: 'Sống "Thật"', icon: '🍃', description: 'Có thời gian dùng MXH ít hơn thời gian làm việc (Pomodoro) trong ngày.', unlocked: true, color: 'bg-teal-100' },
  { id: '10', name: 'Vòng Lặp Hoàn Hảo', icon: '✨', description: 'Đạt được mục tiêu tập trung liên tục trong 30 ngày.', unlocked: false, color: 'bg-yellow-100' },
];

export const QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "Focus on being productive instead of busy.",
  "The secret of getting ahead is getting started.",
  "Your future is created by what you do today, not tomorrow.",
];
