
import React, { useState, useMemo } from 'react';
import { 
    Play, Clock, Plus, X, Zap, Target, ArrowRight, Brain, Sparkle, Flame, Bell, ChevronRight, BarChart3, Activity, Eye, BookOpen, TrendingUp, Info, Scale, Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Task, AppUsage, DailyStats, Tab, UserMood, UserProgression } from '../types';
import { WEEKLY_STATS } from '../constants';
import AICoachCard from './AICoachCard';

interface DashboardProps {
  tasks: Task[];
  usage: AppUsage[];
  stats: DailyStats;
  streak: number;
  progression: UserProgression;
  onNavigate: (tab: Tab) => void;
  onStartFocus: (taskId?: string) => void;
  onToggleTask: (id: string) => void;
  onQuickAddTask: (title: string) => void;
  onCompleteQuest: (points: number) => void;
}

interface MoodOption {
    type: UserMood;
    emoji: string;
    color: string;
}

const MOODS: MoodOption[] = [
    { type: 'Focus', emoji: '🎯', color: 'bg-violet-500' },
    { type: 'Energized', emoji: '⚡', color: 'bg-amber-500' },
    { type: 'Relaxed', emoji: '🍃', color: 'bg-teal-500' },
    { type: 'Stressed', emoji: '🤯', color: 'bg-rose-500' },
    { type: 'Tired', emoji: '😴', color: 'bg-slate-500' },
];

type TrendType = 'study' | 'social';

const Dashboard: React.FC<DashboardProps> = ({ 
  tasks, usage, stats, streak, progression, onNavigate, onStartFocus, onToggleTask, onQuickAddTask, onCompleteQuest 
}) => {
  const [mood, setMood] = useState<UserMood>('Focus');
  const [trendType, setTrendType] = useState<TrendType>('study');

  const totalSocialMinutes = useMemo(() => usage.reduce((acc, curr) => acc + curr.minutes, 0), [usage]);

  const topTask = useMemo(() => {
    const pending = tasks.filter(t => !t.completed);
    if (pending.length === 0) return null;
    
    return [...pending].sort((a, b) => {
      const priorityMap = { High: 3, Medium: 2, Low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    })[0];
  }, [tasks]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const chartData = useMemo(() => {
    return WEEKLY_STATS.map(s => ({
      name: s.date,
      value: trendType === 'study' ? s.studyMinutes : s.socialMinutes,
      display: `${trendType === 'study' ? s.studyMinutes : s.socialMinutes}m`
    }));
  }, [trendType]);

  const chartConfig = {
    study: { color: '#8B5CF6', label: 'Study Time' },
    social: { color: '#F43F5E', label: 'Social Usage' }
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-40 px-6 pt-10 bg-[#F8FAFC] dark:bg-slate-950">
      
      {/* Header */}
      <header className="mb-10 flex justify-between items-start">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 px-3 py-1.5 rounded-2xl border border-orange-200 dark:border-orange-800/50 shadow-sm active:scale-95 transition-transform cursor-pointer">
                    <Flame size={14} className="text-orange-600 fill-orange-500" />
                    <span className="text-[11px] font-black text-orange-700 dark:text-orange-400 tracking-tight">{streak} DAY STREAK</span>
                </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {greeting},<br/>
                <span className="text-primary">Alex.</span>
            </h1>
        </div>
        <button 
            onClick={() => onNavigate(Tab.PROFILE)}
            className="relative w-14 h-14 rounded-[22px] p-1 bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 overflow-visible active:scale-90 transition-transform"
        >
            <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover rounded-[18px]" />
            {/* Level Badge Overlay */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-lg">
                {progression.level}
            </div>
        </button>
      </header>

      <AICoachCard tasks={tasks} usage={usage} focusScore={stats.focusScore} mood={mood} />

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {/* Card Cân bằng thời gian - KHÔNG nhảy trang */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-[36px] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Balance</p>
                <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-primary">
                    <Scale size={14} />
                </div>
            </div>
            <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.studyMinutes}m</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Focus</span>
            </div>
            {/* Visual Balance Bar */}
            <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative z-10">
                <div 
                    className="h-full bg-primary" 
                    style={{ width: `${(stats.studyMinutes / (stats.studyMinutes + totalSocialMinutes || 1)) * 100}%` }} 
                />
                <div 
                    className="h-full bg-rose-400" 
                    style={{ width: `${(totalSocialMinutes / (stats.studyMinutes + totalSocialMinutes || 1)) * 100}%` }} 
                />
            </div>
            <div className="mt-2 flex justify-between items-center relative z-10">
                <span className="text-[8px] font-bold text-slate-400 uppercase">Study</span>
                <span className="text-[8px] font-bold text-rose-400 uppercase">Social</span>
            </div>
        </div>

        {/* Level Info - High Impact Visual */}
        <div 
          onClick={() => onNavigate(Tab.PROFILE)}
          className="bg-white dark:bg-slate-900 p-5 rounded-[36px] shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95 transition-all cursor-pointer group"
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Focus Rank</p>
                <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                    <Award size={14} />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate">
                  {progression.rank}
                </span>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="h-full bg-amber-500 transition-all duration-1000" 
                        style={{ width: `${(progression.xp % 1000) / 10}%` }} 
                    />
                </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[9px] font-bold text-primary group-hover:translate-x-1 transition-transform">
                Lvl {progression.level} Progression <ChevronRight size={10} />
            </div>
        </div>
      </div>

      {/* Top Priority Task */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4 px-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority Mission</h2>
            {topTask && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 uppercase tracking-tighter">High Impact</span>}
        </div>
        
        {topTask ? (
            <div className="bg-slate-900 dark:bg-primary rounded-[36px] p-8 shadow-2xl relative overflow-hidden group border border-slate-800 dark:border-white/10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/10 transition-colors" />
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 text-white`}>
                                {topTask.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/60">
                            <Clock size={14} />
                            <span className="text-[11px] font-bold">{topTask.durationMinutes}M</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-8 leading-tight line-clamp-2 min-h-[3.5rem]">{topTask.title}</h3>
                    <button 
                        onClick={() => onStartFocus(topTask.id)}
                        className="w-full py-5 bg-white text-slate-900 rounded-[22px] font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/30"
                    >
                        <Zap size={18} fill="currentColor" /> ENTER FLOW STATE
                    </button>
                </div>
            </div>
        ) : (
            <div 
              onClick={() => onNavigate(Tab.TASKS)}
              className="bg-slate-100 dark:bg-slate-900 p-12 rounded-[36px] text-center border-2 border-dashed border-slate-200 dark:border-slate-800 active:bg-slate-200 transition-colors cursor-pointer"
            >
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Plus size={24} className="text-slate-400" />
                </div>
                <p className="text-slate-500 font-bold text-sm">All cleared. Tap to add more.</p>
            </div>
        )}
      </section>

      {/* Analytics Trend */}
      <section className="bg-white dark:bg-slate-900 p-7 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm mb-10 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
              <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Activity Trend</h3>
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartConfig[trendType].color }} />
                      <span className="text-sm font-bold dark:text-white">{chartConfig[trendType].label}</span>
                  </div>
              </div>
              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setTrendType('study')}
                    className={`p-2 rounded-lg transition-all ${trendType === 'study' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                      <BookOpen size={16} />
                  </button>
                  <button 
                    onClick={() => setTrendType('social')}
                    className={`p-2 rounded-lg transition-all ${trendType === 'social' ? 'bg-white dark:bg-slate-700 shadow-sm text-red-500' : 'text-slate-400'}`}
                  >
                      <Eye size={16} />
                  </button>
              </div>
          </div>

          <div className="h-40 w-full mt-4 -ml-4">
              <ResponsiveContainer width="110%" height="100%">
                  <AreaChart data={chartData}>
                      <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chartConfig[trendType].color} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={chartConfig[trendType].color} stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} 
                        dy={10}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-xl">
                                        {payload[0].value}m
                                    </div>
                                );
                            }
                            return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke={chartConfig[trendType].color} 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationDuration={1500}
                      />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </section>

      {/* Mood Selector */}
      <section className="mb-10">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">How's your vibe?</h2>
        <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-[28px] border border-white dark:border-slate-800 shadow-sm">
            {MOODS.map(m => (
                <button 
                  key={m.type}
                  onClick={() => setMood(m.type)}
                  className={`flex-1 py-4 flex flex-col items-center justify-center rounded-[20px] transition-all relative ${
                    mood === m.type 
                    ? `${m.color} text-white shadow-xl scale-110 z-10` 
                    : 'opacity-40 hover:opacity-100 hover:scale-105 dark:text-slate-400'
                  }`}
                >
                    <span className="text-2xl mb-1.5">{m.emoji}</span>
                    <span className={`text-[9px] font-black uppercase tracking-tight ${mood === m.type ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {m.type}
                    </span>
                    {mood === m.type && <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full animate-ping" />}
                </button>
            ))}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
