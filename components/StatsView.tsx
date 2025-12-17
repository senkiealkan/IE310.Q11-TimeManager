
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AppUsage } from '../types';
import { WEEKLY_STATS } from '../constants';
import { 
  Smartphone, BookOpen, TrendingDown, ShieldAlert, 
  Lock, Clock, Edit3, X, Zap 
} from 'lucide-react';

interface StatsViewProps {
  usage: AppUsage[];
}

const StatsView: React.FC<StatsViewProps> = ({ usage: initialUsage }) => {
  // Local state to manage interactive features
  const [apps, setApps] = useState<AppUsage[]>(initialUsage);
  const [editingApp, setEditingApp] = useState<AppUsage | null>(null);
  const [newLimit, setNewLimit] = useState<number>(0);
  
  // Detox Mode State
  const [isDetoxActive, setIsDetoxActive] = useState(false);
  const [detoxTimeLeft, setDetoxTimeLeft] = useState(60 * 60); // 60 minutes in seconds

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isDetoxActive && detoxTimeLeft > 0) {
      interval = setInterval(() => {
        setDetoxTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (detoxTimeLeft === 0) {
      setIsDetoxActive(false);
      setDetoxTimeLeft(60 * 60);
      alert("Detox Session Complete!");
    }
    return () => clearInterval(interval);
  }, [isDetoxActive, detoxTimeLeft]);

  const totalUsage = apps.reduce((acc, curr) => acc + curr.minutes, 0);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAppClick = (app: AppUsage) => {
    if (isDetoxActive) return; // Prevent editing during detox
    setEditingApp(app);
    setNewLimit(app.limit);
  };

  const saveLimit = () => {
    if (editingApp) {
      setApps(prev => prev.map(a => a.name === editingApp.name ? { ...a, limit: newLimit } : a));
      setEditingApp(null);
    }
  };

  const toggleDetox = () => {
    if (!isDetoxActive) {
      const confirm = window.confirm("Activate Dopamine Detox? This will lock your social apps for 60 minutes.");
      if (confirm) setIsDetoxActive(true);
    } else {
      const confirm = window.confirm("Give up on Detox? You'll lose your streak.");
      if (confirm) {
        setIsDetoxActive(false);
        setDetoxTimeLeft(60 * 60);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6 pt-6 bg-surface">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Digital Wellbeing</h1>
            <p className="text-sm text-slate-500">Manage your screen time</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-slate-800">{Math.floor(totalUsage / 60)}h {totalUsage % 60}m</div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1">
                <TrendingDown size={12} />
                <span>12% vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Dopamine Detox Card */}
        <div className={`rounded-2xl p-5 mb-8 shadow-lg transition-all relative overflow-hidden ${isDetoxActive ? 'bg-slate-900 text-white' : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'}`}>
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-center relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                    {isDetoxActive ? <Lock size={20} className="text-red-400" /> : <Zap size={20} className="text-yellow-300" />}
                    <h3 className="font-bold text-lg">{isDetoxActive ? 'Detox Active' : 'Dopamine Detox'}</h3>
                </div>
                <p className={`text-xs ${isDetoxActive ? 'text-slate-400' : 'text-purple-100'}`}>
                    {isDetoxActive ? 'Social apps are currently locked.' : 'Lock distractions for 60 mins.'}
                </p>
              </div>
              
              {isDetoxActive ? (
                  <div className="text-right">
                      <div className="text-3xl font-mono font-bold tracking-widest">{formatTime(detoxTimeLeft)}</div>
                      <button onClick={toggleDetox} className="text-xs text-red-400 underline mt-1">Give Up</button>
                  </div>
              ) : (
                  <button 
                    onClick={toggleDetox}
                    className="px-4 py-2 bg-white text-purple-600 font-bold text-sm rounded-xl shadow-md hover:bg-slate-100 transition-colors"
                  >
                    Start Mode
                  </button>
              )}
          </div>
        </div>

        {/* Comparison Chart (Compact) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Weekly Trend</h3>
          <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_STATS} barSize={12}>
                      <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} interval={1} />
                      <Tooltip 
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                          cursor={{fill: '#f1f5f9'}}
                      />
                      <Bar dataKey="studyMinutes" stackId="a" fill="#8B5CF6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="socialMinutes" stackId="a" fill="#FDA4AF" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
        </div>

        {/* App Limits & Usage List */}
        <div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Smartphone size={16} className="text-slate-500" />
              App Limits & Usage
          </h3>
          
          <div className="space-y-3 relative">
              {/* Detox Overlay */}
              {isDetoxActive && (
                <div className="absolute inset-0 z-20 bg-slate-900/10 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center border border-slate-200/50">
                    <Lock size={32} className="text-slate-800 mb-2 drop-shadow-md" />
                    <span className="text-xs font-bold text-slate-800 bg-white/80 px-3 py-1 rounded-full backdrop-blur-md">Apps Locked</span>
                </div>
              )}

              {apps.map((app) => {
                const progress = Math.min(100, (app.minutes / app.limit) * 100);
                const isOverLimit = app.minutes > app.limit;

                return (
                  <button 
                    key={app.name}
                    onClick={() => handleAppClick(app)}
                    disabled={isDetoxActive}
                    className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-md transition-all active:scale-[0.99] text-left group"
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                            style={{ backgroundColor: app.color }}
                          >
                              {/* Simple icon logic based on name mock */}
                              <span className="font-bold text-xs">{app.name[0]}</span>
                          </div>
                          <div>
                              <h4 className="font-semibold text-slate-800 text-sm">{app.name}</h4>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock size={10} />
                                <span>{app.minutes}m used</span>
                                <span className="text-slate-300">•</span>
                                <span>Limit: {app.limit}m</span>
                              </div>
                          </div>
                      </div>
                      
                      {isOverLimit ? (
                          <ShieldAlert size={20} className="text-red-500 animate-pulse" />
                      ) : (
                          <Edit3 size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                          className={`h-full rounded-full transition-all duration-500 ${isOverLimit ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Edit Limit Modal - Outside Scrollable Area */}
      {editingApp && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
              <div className="bg-white w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{backgroundColor: editingApp.color}}>
                            <span className="font-bold">{editingApp.name[0]}</span>
                         </div>
                         <div>
                             <h3 className="font-bold text-lg text-slate-800">Set Limit</h3>
                             <p className="text-xs text-slate-500">{editingApp.name}</p>
                         </div>
                      </div>
                      <button onClick={() => setEditingApp(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                          <X size={18} className="text-slate-600" />
                      </button>
                  </div>

                  <div className="mb-8 text-center">
                      <div className="text-4xl font-bold text-slate-800 mb-2">{newLimit} <span className="text-lg font-medium text-slate-400">min</span></div>
                      <p className="text-xs text-slate-400">Daily usage limit</p>
                  </div>

                  <input 
                    type="range" 
                    min="5" 
                    max="180" 
                    step="5" 
                    value={newLimit}
                    onChange={(e) => setNewLimit(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary mb-8"
                  />

                  <button 
                    onClick={saveLimit}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-transform"
                  >
                      Save Limit
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default StatsView;
