import React, { useState } from 'react';
import { AppUsage, Task } from '../types';
import { 
  Smartphone, TrendingDown, Edit3, X, Zap, 
  ArrowUpRight, EyeOff, Activity, Search,
  Instagram, Youtube, MessageCircle, Music2,
  Plus, Facebook, Twitter, Chrome,
  Play, Video, Mail, Ghost, Camera,
  Flame, Target, BarChart3, Trash2, AlertCircle, CheckCircle2
} from 'lucide-react';

interface StatsViewProps {
  usage: AppUsage[];
  setUsage: React.Dispatch<React.SetStateAction<AppUsage[]>>;
  tasks: Task[];
  focusScore: number;
  onStartDetox?: () => void;
}

const APP_CONFIG: Record<string, { icon: React.ElementType, color: string }> = {
  'Instagram': { icon: Instagram, color: '#E1306C' },
  'TikTok': { icon: Music2, color: '#000000' },
  'YouTube': { icon: Youtube, color: '#FF0000' },
  'WhatsApp': { icon: MessageCircle, color: '#25D366' },
  'Facebook': { icon: Facebook, color: '#1877F2' },
  'Twitter': { icon: Twitter, color: '#1DA1F2' },
  'X': { icon: Twitter, color: '#000000' },
  'Chrome': { icon: Chrome, color: '#4285F4' },
  'Netflix': { icon: Play, color: '#E50914' },
  'Twitch': { icon: Video, color: '#9146FF' },
  'Gmail': { icon: Mail, color: '#D44638' },
  'Snapchat': { icon: Ghost, color: '#FFFC00' },
  'Messenger': { icon: MessageCircle, color: '#00B2FF' },
  'Camera': { icon: Camera, color: '#34495e' },
};

const SUGGESTED_APPS = ['Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Facebook', 'Netflix', 'Gmail'];

const StatsView: React.FC<StatsViewProps> = ({ usage, setUsage, tasks, focusScore, onStartDetox }) => {
  const [editingApp, setEditingApp] = useState<AppUsage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [newLimit, setNewLimit] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const [addAppName, setAddAppName] = useState('');
  const [addAppLimit, setAddAppLimit] = useState(30);
  const [addAppColor, setAddAppColor] = useState('#8B5CF6');
  
  const totalUsage = usage.reduce((acc, curr) => acc + curr.minutes, 0);
  const dailyGoal = 300; 
  const progressPercent = Math.min(100, (totalUsage / dailyGoal) * 100);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const focusStreak = 7; 

  const handleAppClick = (app: AppUsage) => {
    setEditingApp(app);
    setNewLimit(app.limit);
  };

  const saveLimit = () => {
    if (editingApp) {
      setUsage(prev => prev.map(a => a.name === editingApp.name ? { ...a, limit: newLimit } : a));
      setEditingApp(null);
    }
  };

  // Hàm xóa ứng dụng đã được sửa lỗi:
  const handleDeleteApp = (e: React.MouseEvent, appName: string) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan lên thẻ cha (ngăn mở modal)
    if (window.confirm(`Ngừng theo dõi ứng dụng "${appName}"?`)) {
      setUsage(prev => prev.filter(app => app.name !== appName));
      if (editingApp?.name === appName) setEditingApp(null);
    }
  };

  const handleAddApp = () => {
    if (!addAppName.trim()) return;
    const appExists = usage.some(a => a.name.toLowerCase() === addAppName.toLowerCase());
    if (appExists) {
        alert("Ứng dụng này đã có trong danh sách.");
        return;
    }

    const config = APP_CONFIG[addAppName] || { icon: Smartphone, color: addAppColor };
    const newApp: AppUsage = {
        name: addAppName,
        minutes: 0,
        limit: addAppLimit,
        icon: '', 
        color: config.color || addAppColor
    };

    setUsage(prev => [...prev, newApp]);
    setShowAddModal(false);
    setAddAppName('');
  };

  const filteredApps = usage.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-surface dark:bg-slate-950">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 z-0">
         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-10 relative z-10">
        
        <div className="flex justify-between items-center mb-8 text-white px-2">
           <div>
              <h1 className="text-2xl font-black tracking-tight">Digital Wellbeing</h1>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-[0.3em]">Usage Control</p>
           </div>
           <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <BarChart3 size={20} />
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-5 rounded-[32px] text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                 <div className="p-1.5 bg-white/20 rounded-lg">
                    <Flame size={16} fill="white" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">Consistency</span>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-4xl font-black">{focusStreak}</span>
                 <span className="text-xs font-bold opacity-80 uppercase">Days</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <Target size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Missions</span>
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">{taskCompletionRate}%</span>
              </div>
              <div className="text-sm font-black text-slate-800 dark:text-white">{completedTasksCount} / {totalTasks} Completed</div>
           </div>
        </div>

        {/* Screen Time Progress */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 mb-8">
           <div className="flex items-center gap-2 mb-6">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
             <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Screen Time Activity</h3>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    <circle 
                       cx="50" cy="50" r="38" stroke="#8B5CF6" strokeWidth="10" fill="transparent" 
                       strokeDasharray={238.7} strokeDashoffset={238.7 - (progressPercent / 100) * 238.7}
                       strokeLinecap="round" className="transition-all duration-1000"
                    />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-black text-slate-800 dark:text-white">{Math.round(progressPercent)}%</span>
                 </div>
              </div>

              <div className="flex-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Monitored</span>
                 <div className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">
                    {Math.floor(totalUsage / 60)}h {totalUsage % 60}m
                 </div>
              </div>
           </div>
        </div>

        {/* App Limits Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
                <Smartphone size={20} className="text-indigo-600" />
                Tracked Apps
              </h3>
              <div className="flex gap-2">
                 <button onClick={() => setIsSearching(!isSearching)} className={`p-2 rounded-xl transition-all ${isSearching ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <Search size={18} />
                 </button>
                 <button onClick={() => setShowAddModal(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                    <Plus size={20} />
                 </button>
              </div>
          </div>

          {isSearching && (
              <div className="px-1 mb-6 animate-in slide-in-from-top-2">
                  <div className="relative">
                      <input 
                        autoFocus type="text" placeholder="Filter apps..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-10 py-3.5 text-sm font-semibold outline-none focus:border-primary transition-all text-slate-800 dark:text-white shadow-sm"
                      />
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
              </div>
          )}

          <div className="space-y-4">
              {filteredApps.length > 0 ? filteredApps.map((app) => {
                const progress = Math.min(100, (app.minutes / app.limit) * 100);
                const isOverLimit = app.minutes > app.limit;
                const isNearLimit = !isOverLimit && progress > 80;
                const Icon = APP_CONFIG[app.name]?.icon || Smartphone;

                return (
                  <div 
                    key={app.name}
                    onClick={() => handleAppClick(app)}
                    className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group relative cursor-pointer active:bg-slate-50 dark:active:bg-slate-800"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[20px] flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: app.color }}>
                              <Icon size={24} />
                          </div>
                          <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-800 dark:text-white text-sm">{app.name}</h4>
                                {isOverLimit ? (
                                    <span className="flex items-center gap-1 text-[8px] font-black text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                        <AlertCircle size={8} /> Danger
                                    </span>
                                ) : isNearLimit ? (
                                    <span className="flex items-center gap-1 text-[8px] font-black text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                        <Zap size={8} /> Near Limit
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[8px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                        <CheckCircle2 size={8} /> Safe
                                    </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{app.minutes}m / {app.limit}m used</p>
                          </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Nút xóa đã được bọc stopPropagation để không bị kích hoạt cha */}
                        <button 
                            type="button"
                            onClick={(e) => handleDeleteApp(e, app.name)}
                            className="w-10 h-10 flex items-center justify-center text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm z-20"
                            aria-label="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                        <div className="w-10 h-10 flex items-center justify-center text-slate-300 dark:text-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all">
                            <Edit3 size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isOverLimit ? 'bg-gradient-to-r from-red-500 to-rose-600' : isNearLimit ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-primary to-indigo-600'}`}
                          style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }) : (
                  <div className="py-20 text-center flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
                        <Smartphone size={32} className="text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold italic text-sm">No apps found.</p>
                  </div>
              )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingApp && (
          <div className="absolute inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-t-[50px] sm:rounded-[40px] p-10 shadow-2xl animate-in slide-in-from-bottom-10">
                  <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-[22px] flex items-center justify-center text-white shadow-xl" style={{backgroundColor: editingApp.color}}>
                            {React.createElement(APP_CONFIG[editingApp.name]?.icon || Smartphone, { size: 28 })}
                         </div>
                         <h3 className="font-black text-xl text-slate-800 dark:text-white">{editingApp.name}</h3>
                      </div>
                      <button onClick={() => setEditingApp(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-400">
                          <X size={24} />
                      </button>
                  </div>

                  <div className="mb-10 text-center">
                      <div className="text-7xl font-black text-slate-800 dark:text-white tabular-nums">{newLimit}</div>
                      <div className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-2">Daily Goal Minutes</div>
                  </div>

                  <input 
                        type="range" min="5" max="240" step="5" value={newLimit}
                        onChange={(e) => setNewLimit(Number(e.target.value))}
                        className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary mb-10"
                    />

                  <div className="space-y-3">
                    <button onClick={saveLimit} className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                        Confirm Changes
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => handleDeleteApp(e, editingApp.name)} 
                        className="w-full py-4 text-red-500 bg-red-50 dark:bg-red-900/20 font-black rounded-3xl active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                    >
                        <Trash2 size={16} /> Stop Tracking This App
                    </button>
                  </div>
              </div>
          </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
          <div className="absolute inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-t-[50px] sm:rounded-[40px] p-10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="font-black text-2xl text-slate-800 dark:text-white">Track New App</h3>
                      <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500"><X size={20} /></button>
                  </div>

                  <div className="space-y-6 mb-10">
                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Application Name</label>
                          <input 
                            autoFocus type="text" placeholder="e.g. Instagram" value={addAppName}
                            onChange={(e) => setAddAppName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-primary text-slate-800 dark:text-white shadow-inner"
                          />
                      </div>

                      <div className="flex flex-wrap gap-2">
                         {SUGGESTED_APPS.map(appName => (
                            <button 
                                key={appName} onClick={() => { setAddAppName(appName); setAddAppColor(APP_CONFIG[appName]?.color || '#8B5CF6'); }}
                                className={`px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-tight transition-all ${addAppName === appName ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                            >
                                {appName}
                            </button>
                         ))}
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Daily Time Limit: {addAppLimit} mins</label>
                          <input 
                            type="range" min="5" max="240" step="5" value={addAppLimit}
                            onChange={(e) => setAddAppLimit(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-primary"
                          />
                      </div>
                  </div>

                  <button onClick={handleAddApp} disabled={!addAppName.trim()} className="w-full py-5 bg-slate-900 dark:bg-primary text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all uppercase tracking-widest text-[10px]">
                      Add to Monitoring
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default StatsView;