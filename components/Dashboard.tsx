
import React, { useMemo, useState } from 'react';
import { 
    Play, Clock, CheckCircle2, Circle, 
    Plus, X, Zap, Target, Star, Trophy, ArrowRight, Info, AlertTriangle, ShieldCheck, Brain, Sparkle
} from 'lucide-react';
import { Task, AppUsage, DailyStats, Tab, UserMood, DailyChallenge } from '../types';
import AICoachCard from './AICoachCard';
import { QUOTES } from '../constants';

interface DashboardProps {
  tasks: Task[];
  usage: AppUsage[];
  stats: DailyStats;
  onNavigate: (tab: Tab) => void;
  onStartFocus: () => void;
  onToggleTask: (id: string) => void;
  onQuickAddTask: (title: string) => void;
}

const MOODS: { type: UserMood; emoji: string; color: string }[] = [
    { type: 'Focus', emoji: '🎯', color: 'bg-blue-100' },
    { type: 'Energized', emoji: '⚡', color: 'bg-yellow-100' },
    { type: 'Relaxed', emoji: '🍃', color: 'bg-green-100' },
    { type: 'Stressed', emoji: '🤯', color: 'bg-red-100' },
    { type: 'Tired', emoji: '😴', color: 'bg-purple-100' },
];

const Dashboard: React.FC<DashboardProps> = ({ 
  tasks, 
  usage, 
  stats, 
  onNavigate, 
  onStartFocus,
  onToggleTask,
  onQuickAddTask
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [mood, setMood] = useState<UserMood>('Focus');
  const [challenges, setChallenges] = useState<DailyChallenge[]>([
      { id: '1', title: 'Finish 2 High Priority Tasks', reward: 50, completed: false },
      { id: '2', title: 'Deep Work for 60 Minutes', reward: 30, completed: true },
      { id: '3', title: 'Zero Distraction for 1 Hour', reward: 40, completed: false },
  ]);

  const pendingTasks = tasks.filter(t => !t.completed);
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    const priorityMap = { High: 3, Medium: 2, Low: 1 };
    return priorityMap[b.priority] - priorityMap[a.priority];
  });

  const mit = sortedPendingTasks[0];
  const goalProgress = Math.min(100, (stats.studyMinutes / 240) * 100); 

  const scoreStatus = useMemo(() => {
    if (stats.focusScore >= 80) return { label: 'Unstoppable', color: 'text-green-500', bg: 'bg-green-100' };
    if (stats.focusScore >= 60) return { label: 'In Zone', color: 'text-blue-500', bg: 'bg-blue-100' };
    if (stats.focusScore >= 40) return { label: 'Steady', color: 'text-orange-500', bg: 'bg-orange-100' };
    return { label: 'Distracted', color: 'text-red-500', bg: 'bg-red-100' };
  }, [stats.focusScore]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (stats.focusScore / 100) * circumference;

  // Quest Calculations
  const earnedXP = challenges.filter(c => c.completed).reduce((acc, c) => acc + c.reward, 0);
  const totalXP = challenges.reduce((acc, c) => acc + c.reward, 0);
  const xpProgress = (earnedXP / totalXP) * 100;

  const handleSubmitQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTaskTitle.trim()) {
      onQuickAddTask(quickTaskTitle);
      setQuickTaskTitle("");
      setShowQuickAdd(false);
    }
  };

  const toggleChallenge = (id: string) => {
      setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6 bg-surface">
      
      {/* Header */}
      <header className="mb-6">
        <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Hi, Alex! 👋</h1>
                <p className="text-sm text-slate-500 font-medium">Ready to crush it today?</p>
            </div>
            <button 
                onClick={() => onNavigate(Tab.PROFILE)} 
                className="relative group transition-transform active:scale-95"
            >
                <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden border-2 border-white shadow-md">
                    <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </button>
        </div>

        <div className="flex justify-between items-center bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/50 shadow-sm">
            {MOODS.map(m => (
                <button 
                    key={m.type}
                    onClick={() => setMood(m.type)}
                    className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 ${
                        mood === m.type ? `${m.color} scale-105 shadow-sm ring-1 ring-slate-200/50` : 'opacity-40 hover:opacity-100'
                    }`}
                >
                    <span className="text-xl mb-0.5">{m.emoji}</span>
                    <span className="text-[8px] font-bold uppercase tracking-tight">{m.type}</span>
                </button>
            ))}
        </div>
      </header>

      <AICoachCard tasks={tasks} usage={usage} focusScore={stats.focusScore} mood={mood} />

      {/* Focus Health Dashboard Card */}
      <div 
        onClick={() => setShowScoreInfo(true)}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 flex items-center justify-between cursor-pointer hover:border-primary/40 transition-all active:scale-[0.98]"
      >
        <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Focus Health</span>
                <Info size={12} className="text-slate-300" />
            </div>
            <div className={`text-2xl font-black ${scoreStatus.color} mb-1 flex items-center gap-2`}>
                {stats.focusScore}
                <span className="text-sm font-bold text-slate-300">/100</span>
            </div>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase ${scoreStatus.bg} ${scoreStatus.color}`}>
                {scoreStatus.label}
            </div>
        </div>

        <div className="relative w-20 h-20 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r={radius} stroke="#f8fafc" strokeWidth="8" fill="transparent" />
                <circle 
                    cx="40" cy="40" r={radius} 
                    stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={progressOffset} 
                    strokeLinecap="round"
                    className={`${scoreStatus.color} transition-all duration-1000 ease-in-out`}
                />
             </svg>
             <Brain size={22} className={`absolute ${scoreStatus.color} drop-shadow-sm`} />
        </div>
      </div>

      {/* Goal Progress Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                    <Target size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Deep Work Goal</span>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                {Math.floor(stats.studyMinutes)}<span className="opacity-50 mx-0.5">/</span>240m
              </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_8px_rgba(139,92,246,0.3)]"
                style={{ width: `${goalProgress}%` }}
              ></div>
          </div>
      </div>

      {/* High Impact Task Card */}
      <div className="mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
            <Star size={14} className="text-amber-500" /> Priority Spotlight
        </h3>
        {mit ? (
            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200 relative overflow-hidden group active:scale-[0.98] transition-transform">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                <div className="relative z-10">
                    <span className="inline-block px-2 py-0.5 bg-white/10 text-white/80 text-[10px] font-bold rounded-lg uppercase mb-3 backdrop-blur-sm border border-white/50">
                        High ROI Task
                    </span>
                    <h4 className="text-xl font-bold text-white mb-6 line-clamp-2 leading-snug">{mit.title}</h4>
                    <div className="flex gap-3">
                        <button 
                            onClick={onStartFocus}
                            className="flex-[2] bg-white text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                        >
                            <Play size={18} fill="currentColor" /> ENTER FOCUS
                        </button>
                        <button onClick={() => setShowQuickAdd(true)} className="flex-1 bg-white/10 text-white rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/20 transition-all">
                            <Plus size={24} />
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <button onClick={onStartFocus} className="w-full bg-slate-900 p-6 rounded-3xl text-white font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform">
                <Zap size={22} className="text-yellow-400" /> Start Focus Mode
            </button>
        )}
      </div>

      {/* REFINED DAILY QUESTS SECTION */}
      <div className="mb-8 bg-white/50 rounded-[32px] p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-5 px-1">
            <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500" /> Daily Quests
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{challenges.filter(c => c.completed).length} of {challenges.length} Done</p>
            </div>
            <div className="text-right">
                <div className="text-xs font-black text-primary uppercase">XP: {earnedXP}/{totalXP}</div>
                <div className="w-24 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div 
                        className="h-full bg-primary transition-all duration-700"
                        style={{ width: `${xpProgress}%` }}
                    />
                </div>
            </div>
        </div>
        
        <div className="space-y-3">
            {challenges.map(c => (
                <button 
                    key={c.id}
                    onClick={() => toggleChallenge(c.id)}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 active:scale-[0.98] ${
                        c.completed 
                        ? 'bg-slate-50 border-slate-100 opacity-60' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-primary/30 ring-1 ring-transparent hover:ring-primary/10'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            c.completed ? 'bg-slate-100 text-slate-400' : 'bg-primary/5 text-primary'
                        }`}>
                            {c.completed ? <CheckCircle2 size={24} /> : <Zap size={24} />}
                        </div>
                        <div className="text-left">
                            <p className={`text-sm font-black ${c.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {c.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                                <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${c.completed ? 'bg-slate-200 text-slate-400' : 'bg-amber-100 text-amber-600'}`}>
                                    +{c.reward} XP
                                </div>
                                {c.completed && <span className="text-[8px] font-bold text-green-600 uppercase">Claimed</span>}
                            </div>
                        </div>
                    </div>
                    {!c.completed && <Sparkle size={16} className="text-amber-400 animate-pulse" />}
                </button>
            ))}
        </div>
      </div>

      {/* FIXED MODALS */}
      {showScoreInfo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowScoreInfo(false)}></div>
              <div className="bg-white w-full max-w-sm p-7 rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                  <button onClick={() => setShowScoreInfo(false)} className="absolute top-5 right-5 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                      <X size={18} className="text-slate-600" />
                  </button>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">Focus Health</h3>
                  
                  <div className="space-y-6">
                      <div>
                          <div className="flex justify-between text-xs font-black text-slate-500 uppercase mb-2">
                              <span className="flex items-center gap-2"><Clock size={16} className="text-primary" /> Deep Work</span>
                              <span className="text-primary">+{stats.breakdown?.studyPoints}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div style={{width: `${(stats.breakdown?.studyPoints || 0) * 2.5}%`}} className="h-full bg-primary rounded-full transition-all duration-700"></div>
                          </div>
                      </div>

                      <div>
                          <div className="flex justify-between text-xs font-black text-slate-500 uppercase mb-2">
                              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Task Mastery</span>
                              <span className="text-green-600">+{stats.breakdown?.taskPoints}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div style={{width: `${(stats.breakdown?.taskPoints || 0) * 2.5}%`}} className="h-full bg-green-500 rounded-full transition-all duration-700"></div>
                          </div>
                      </div>

                      <div>
                          <div className="flex justify-between text-xs font-black text-slate-500 uppercase mb-2">
                              <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> Digital Discipline</span>
                              <span className="text-blue-600">+{stats.breakdown?.controlPoints}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div style={{width: `${(stats.breakdown?.controlPoints || 0) * 5}%`}} className="h-full bg-blue-500 rounded-full transition-all duration-700"></div>
                          </div>
                      </div>

                      {(stats.breakdown?.penaltyPoints || 0) > 0 && (
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-red-700 uppercase mb-1">Attention Drain: -{stats.breakdown?.penaltyPoints} PTS</p>
                                <p className="text-[11px] text-red-600/80 leading-relaxed font-medium">Excessive social media usage is impacting your recovery score.</p>
                            </div>
                        </div>
                      )}
                  </div>

                  <button 
                    onClick={() => setShowScoreInfo(false)}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-transform"
                  >
                      CLOSE ANALYSIS
                  </button>
              </div>
          </div>
      )}

      {showQuickAdd && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowQuickAdd(false)}></div>
              <div className="bg-white w-full max-w-md p-7 rounded-[32px] shadow-2xl relative animate-in slide-in-from-bottom-10">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-xl text-slate-800">QUICK TASK</h3>
                      <button onClick={() => setShowQuickAdd(false)} className="p-2 bg-slate-100 rounded-full">
                          <X size={18} className="text-slate-500" />
                      </button>
                  </div>
                  <form onSubmit={handleSubmitQuickAdd}>
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="What needs focus?" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-base font-bold outline-none focus:border-primary focus:ring-1 focus:ring-primary mb-5 shadow-inner"
                        value={quickTaskTitle}
                        onChange={(e) => setQuickTaskTitle(e.target.value)}
                      />
                      <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-transform">
                          ADD TO QUEUE
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
