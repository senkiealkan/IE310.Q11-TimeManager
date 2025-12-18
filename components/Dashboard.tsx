
import React, { useMemo, useState } from 'react';
import { 
    Play, Clock, CheckCircle2, Circle, 
    Plus, X, Zap, Target, Star, Trophy, ArrowRight, Info, AlertTriangle, ShieldCheck, Brain, Sparkle, Flame
} from 'lucide-react';
import { Task, AppUsage, DailyStats, Tab, UserMood, DailyChallenge } from '../types';
import AICoachCard from './AICoachCard';

interface DashboardProps {
  tasks: Task[];
  usage: AppUsage[];
  stats: DailyStats;
  onNavigate: (tab: Tab) => void;
  onStartFocus: () => void;
  onToggleTask: (id: string) => void;
  onQuickAddTask: (title: string) => void;
  onCompleteQuest: (xp: number) => void;
}

const MOODS: { type: UserMood; emoji: string; color: string; ring: string }[] = [
    { type: 'Focus', emoji: '🎯', color: 'bg-blue-50', ring: 'ring-blue-400' },
    { type: 'Energized', emoji: '⚡', color: 'bg-yellow-50', ring: 'ring-yellow-400' },
    { type: 'Relaxed', emoji: '🍃', color: 'bg-green-50', ring: 'ring-green-400' },
    { type: 'Stressed', emoji: '🤯', color: 'bg-red-50', ring: 'ring-red-400' },
    { type: 'Tired', emoji: '😴', color: 'bg-purple-50', ring: 'ring-purple-400' },
];

const Dashboard: React.FC<DashboardProps> = ({ 
  tasks, 
  usage, 
  stats, 
  onNavigate, 
  onStartFocus,
  onToggleTask,
  onQuickAddTask,
  onCompleteQuest
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [mood, setMood] = useState<UserMood>('Focus');
  const [challenges, setChallenges] = useState<DailyChallenge[]>([
      { id: '1', title: 'Finish 2 High Priority Tasks', reward: 150, completed: false },
      { id: '2', title: 'Deep Work for 60 Minutes', reward: 100, completed: true },
      { id: '3', title: 'Zero Distraction for 1 Hour', reward: 120, completed: false },
  ]);

  const pendingTasks = tasks.filter(t => !t.completed);
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    const priorityMap = { High: 3, Medium: 2, Low: 1 };
    return priorityMap[b.priority] - priorityMap[a.priority];
  });

  const mit = sortedPendingTasks[0];
  const goalProgress = Math.min(100, (stats.studyMinutes / 240) * 100); 

  const scoreStatus = useMemo(() => {
    if (stats.focusScore >= 80) return { label: 'Unstoppable', color: 'text-green-500', bg: 'bg-green-100', multiplier: '1.5x XP' };
    if (stats.focusScore >= 60) return { label: 'In Zone', color: 'text-blue-500', bg: 'bg-blue-100', multiplier: '1.2x XP' };
    if (stats.focusScore >= 40) return { label: 'Steady', color: 'text-orange-500', bg: 'bg-orange-100', multiplier: '1.0x XP' };
    return { label: 'Distracted', color: 'text-red-500', bg: 'bg-red-100', multiplier: '0.8x XP' };
  }, [stats.focusScore]);

  const xpProgress = (stats.xp / 1000) * 100;

  const toggleChallenge = (id: string) => {
      const challenge = challenges.find(c => c.id === id);
      if (challenge && !challenge.completed) {
          onCompleteQuest(challenge.reward);
      }
      setChallenges(prev => prev.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const currentMoodData = MOODS.find(m => m.type === mood) || MOODS[0];

  return (
    <div className={`flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6 transition-colors duration-500 ${currentMoodData.color}`}>
      
      {/* Header with REAL Level Progress */}
      <header className="mb-6">
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                 <button 
                    onClick={() => onNavigate(Tab.PROFILE)} 
                    className="relative transition-transform active:scale-90"
                >
                    <div className="w-14 h-14 rounded-2xl bg-white p-0.5 shadow-sm overflow-hidden border border-slate-200">
                        <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover rounded-[14px]" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Flame size={12} className="text-white fill-white" />
                    </div>
                </button>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Alex!</h1>
                        <span className="text-[9px] font-black text-white bg-slate-900 px-1.5 py-0.5 rounded-md uppercase tracking-widest">LVL {stats.level}</span>
                    </div>
                    <div className="w-32 h-2 bg-white/50 rounded-full overflow-hidden border border-white/20">
                        <div 
                            className="h-full bg-primary transition-all duration-700 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                            style={{ width: `${xpProgress}%` }}
                        />
                    </div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">{stats.xp} / 1000 XP</p>
                </div>
            </div>
            <button onClick={() => setShowQuickAdd(true)} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 active:scale-95 transition-all">
                <Plus size={20} />
            </button>
        </div>

        {/* Mood Selector */}
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-xl p-1.5 rounded-[22px] border border-white/60 shadow-inner mb-6">
            {MOODS.map(m => (
                <button 
                    key={m.type}
                    onClick={() => setMood(m.type)}
                    className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-[18px] transition-all duration-300 ${
                        mood === m.type ? `bg-white scale-100 shadow-sm ring-1 ring-slate-200` : 'opacity-40 hover:opacity-100'
                    }`}
                >
                    <span className={`text-xl mb-0.5 transition-transform ${mood === m.type ? 'scale-110' : ''}`}>{m.emoji}</span>
                    <span className="text-[7px] font-black uppercase tracking-widest">{m.type}</span>
                </button>
            ))}
        </div>
      </header>

      <AICoachCard tasks={tasks} usage={usage} focusScore={stats.focusScore} mood={mood} />

      {/* Focus Health & Goal - Showing Impact */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div 
            onClick={() => setShowScoreInfo(true)}
            className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer group active:scale-[0.96] transition-all"
        >
            <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Focus Power</span>
                <div className={`text-3xl font-black ${scoreStatus.color} tracking-tighter`}>{stats.focusScore}</div>
                <div className={`inline-flex px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase mt-1 ${scoreStatus.bg} ${scoreStatus.color}`}>
                    {scoreStatus.multiplier}
                </div>
            </div>
            <div className="text-[8px] font-bold text-slate-400 mt-4 leading-tight group-hover:text-primary transition-colors">
                High score multiplies your XP earnings! 🚀
            </div>
        </div>

        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-2">Daily Goal</span>
                <div className="text-3xl font-black text-slate-800 tracking-tighter">
                    {Math.floor(stats.studyMinutes)}<span className="text-xs text-slate-300 ml-1">min</span>
                </div>
                <div className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Target: 240m</div>
            </div>
            <div className="mt-4">
                 <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 shadow-sm"
                        style={{ width: `${goalProgress}%` }}
                    />
                 </div>
                 <span className="text-[8px] font-black text-primary mt-1.5 block text-right">Progress: {Math.round(goalProgress)}%</span>
            </div>
        </div>
      </div>

      {/* DAILY QUESTS - High Impact Rewards */}
      <div className="mb-8 bg-slate-900 rounded-[32px] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 rounded-full blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-6 px-1 relative z-10">
            <div>
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500" /> Active Quests
                </h3>
                <p className="text-xl font-black text-white mt-1 tracking-tight">Earn XP to unlock Sounds</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-500 border border-white/10">
                <Sparkle size={24} className="animate-pulse" />
            </div>
        </div>
        
        <div className="space-y-3 relative z-10">
            {challenges.map(c => (
                <button 
                    key={c.id}
                    onClick={() => toggleChallenge(c.id)}
                    disabled={c.completed}
                    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 active:scale-[0.98] ${
                        c.completed 
                        ? 'bg-white/5 border-transparent opacity-40' 
                        : 'bg-white/10 border-white/10 hover:border-primary/40'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                            c.completed ? 'bg-white/10 text-white/20' : 'bg-primary text-white shadow-lg'
                        }`}>
                            {c.completed ? <CheckCircle2 size={20} /> : <Zap size={20} fill="white" />}
                        </div>
                        <div className="text-left">
                            <p className={`text-xs font-black ${c.completed ? 'text-white/20 line-through' : 'text-white'}`}>
                                {c.title}
                            </p>
                            <span className={`text-[8px] font-black uppercase ${c.completed ? 'text-white/20' : 'text-amber-500'}`}>
                                +{c.reward} XP {stats.focusScore >= 80 && !c.completed && <span className="text-green-400">(+50% Buff)</span>}
                            </span>
                        </div>
                    </div>
                    {!c.completed && <ArrowRight size={14} className="text-white/40" />}
                </button>
            ))}
        </div>
      </div>

      {/* Rest of Dashboard code... */}
      <div className="mb-8">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2 px-1">
            <Star size={12} className="text-amber-500" /> Current Priority
        </h3>
        {mit ? (
            <div className="bg-white rounded-[32px] p-7 shadow-sm border border-slate-100 relative group active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-xl uppercase">
                        Mastery Task
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                         <Clock size={12} />
                         <span className="text-[10px] font-bold">{mit.durationMinutes}m</span>
                    </div>
                </div>
                <h4 className="text-2xl font-black text-slate-800 mb-8 line-clamp-2 leading-[1.1]">{mit.title}</h4>
                <button 
                    onClick={onStartFocus}
                    className="w-full h-14 bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                >
                    <Play size={18} fill="currentColor" /> ENTER FOCUS MODE
                </button>
            </div>
        ) : (
            <button onClick={onStartFocus} className="w-full bg-slate-100 p-8 rounded-[32px] text-slate-400 font-black flex items-center justify-center gap-4 active:scale-95 transition-transform border-2 border-dashed border-slate-200">
                <Plus size={24} /> NO PENDING MISSIONS
            </button>
        )}
      </div>

      {/* Modal for score breakdown... */}
      {showScoreInfo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in" onClick={() => setShowScoreInfo(false)}></div>
              <div className="bg-white w-full max-w-sm p-8 rounded-[36px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 text-center">
                  <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${scoreStatus.bg} ${scoreStatus.color}`}>
                      <Brain size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-1">Focus Level: {scoreStatus.label}</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">{scoreStatus.multiplier} Earned Rate</p>
                  
                  <div className="space-y-3 text-left mb-8">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <span className="text-xs font-bold text-slate-500">Deep Work Sessions</span>
                          <span className="text-sm font-black text-slate-800">+{stats.breakdown?.studyPoints} pts</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <span className="text-xs font-bold text-slate-500">Task Completion</span>
                          <span className="text-sm font-black text-slate-800">+{stats.breakdown?.taskPoints} pts</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                          <span className="text-xs font-bold text-red-500">Social Media Penalty</span>
                          <span className="text-sm font-black text-red-600">-{stats.breakdown?.penaltyPoints} pts</span>
                      </div>
                  </div>

                  <button 
                    onClick={() => setShowScoreInfo(false)}
                    className="w-full py-4 bg-slate-900 text-white font-black text-xs rounded-2xl shadow-xl active:scale-95 transition-transform"
                  >
                      I UNDERSTAND
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
