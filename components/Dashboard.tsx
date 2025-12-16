import React, { useMemo } from 'react';
import { Play, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { Task, AppUsage, DailyStats, Tab } from '../types';
import AICoachCard from './AICoachCard';
import { QUOTES } from '../constants';

interface DashboardProps {
  tasks: Task[];
  usage: AppUsage[];
  stats: DailyStats;
  onNavigate: (tab: Tab) => void;
  onStartFocus: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, usage, stats, onNavigate, onStartFocus }) => {
  const pendingTasks = tasks.filter(t => !t.completed);
  const todaysQuote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  // Calculate percentages
  const totalTrackedTime = stats.studyMinutes + stats.socialMinutes;
  const studyPercent = totalTrackedTime === 0 ? 0 : Math.round((stats.studyMinutes / totalTrackedTime) * 100);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6 pt-6 bg-surface">
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Hello, Student! 👋</h1>
            <p className="text-sm text-slate-500">Ready to crush your goals?</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
            <img src="https://picsum.photos/100/100" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* AI Coach Integration */}
      <AICoachCard tasks={tasks} usage={usage} focusScore={stats.focusScore} />

      {/* Daily Progress */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-between items-end mb-3">
            <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Productivity Score</span>
                <div className="text-3xl font-bold text-slate-800 mt-1">{stats.focusScore} <span className="text-sm font-normal text-slate-400">/ 100</span></div>
            </div>
            <div className="flex gap-2">
                <div className="text-right">
                    <div className="text-xs text-slate-400">Study</div>
                    <div className="font-semibold text-primary">{Math.floor(stats.studyMinutes / 60)}h {stats.studyMinutes % 60}m</div>
                </div>
                <div className="w-px bg-slate-100 mx-1"></div>
                <div className="text-right">
                    <div className="text-xs text-slate-400">Social</div>
                    <div className="font-semibold text-red-400">{Math.floor(stats.socialMinutes / 60)}h {stats.socialMinutes % 60}m</div>
                </div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div style={{ width: `${studyPercent}%` }} className="h-full bg-primary transition-all duration-500"></div>
            <div style={{ width: `${100 - studyPercent}%` }} className="h-full bg-red-300 transition-all duration-500"></div>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
            {studyPercent > 50 ? "You're mostly productive today!" : "Watch out for distractions."}
        </p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
            onClick={onStartFocus}
            className="bg-secondary/10 hover:bg-secondary/20 active:scale-95 transition-all p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-secondary/20"
        >
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-sm">
                <Play fill="white" size={18} className="ml-1" />
            </div>
            <span className="font-semibold text-teal-800 text-sm">Start Focus</span>
        </button>

        <button 
            onClick={() => onNavigate(Tab.TASKS)}
            className="bg-blue-50 hover:bg-blue-100 active:scale-95 transition-all p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-blue-100"
        >
            <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center shadow-sm">
                <TrendingUp size={20} />
            </div>
            <span className="font-semibold text-blue-800 text-sm">View Tasks</span>
        </button>
      </div>

      {/* Pending Tasks Preview */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-slate-700">Up Next</h3>
            <button onClick={() => onNavigate(Tab.TASKS)} className="text-xs font-semibold text-primary">See All</button>
        </div>
        <div className="space-y-3">
            {pendingTasks.slice(0, 3).map(task => (
                <div key={task.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                     <div className={`w-1 h-8 rounded-full ${task.priority === 'High' ? 'bg-red-400' : task.priority === 'Medium' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                     <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-800">{task.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{task.category}</span>
                            <span className="flex items-center gap-1"><Clock size={10} /> {task.durationMinutes}m</span>
                        </div>
                     </div>
                     <div className="w-5 h-5 rounded-full border-2 border-slate-200"></div>
                </div>
            ))}
        </div>
      </div>

      {/* Quote */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">Daily Inspiration</p>
        <p className="text-sm text-slate-600 italic">"{todaysQuote}"</p>
      </div>
    </div>
  );
};

export default Dashboard;