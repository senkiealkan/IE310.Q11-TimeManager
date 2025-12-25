
import React, { useState, useMemo } from 'react';
import { AppUsage, Task } from '../types';
import { 
  Smartphone, TrendingDown, Edit3, X, Zap, 
  ArrowUpRight, Activity, Search,
  Instagram, Youtube, MessageCircle, Music2,
  Plus, Facebook, Twitter, Chrome,
  Play, Video, Mail, Ghost, Camera,
  Flame, Target, BarChart3, Trash2, AlertCircle, CheckCircle2,
  Info, TrendingUp, Palette, BookOpen, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { WEEKLY_STATS } from '../constants';

interface StatsViewProps {
  usage: AppUsage[];
  setUsage: React.Dispatch<React.SetStateAction<AppUsage[]>>;
  tasks: Task[];
  focusScore: number;
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

const SUGGESTED_APPS = ['Instagram', 'TikTok', 'YouTube', 'WhatsApp', 'Facebook', 'Netflix', 'Gmail', 'Chrome', 'X'];
const PRESET_COLORS = ['#8B5CF6', '#E1306C', '#000000', '#FF0000', '#25D366', '#1877F2', '#1DA1F2', '#4285F4', '#E50914'];

const StatsView: React.FC<StatsViewProps> = ({ usage, setUsage, tasks, focusScore }) => {
  const [editingApp, setEditingApp] = useState<AppUsage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [appToDelete, setAppToDelete] = useState<string | null>(null);


  const [newLimit, setNewLimit] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [addAppName, setAddAppName] = useState('');
  const [addAppLimit, setAddAppLimit] = useState(60);
  const [addAppColor, setAddAppColor] = useState('#8B5CF6');

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  const focusStreak = 7; 

  // Đồng bộ dữ liệu biểu đồ với danh sách app thực tế
  const comparisonData = useMemo(() => {
    return WEEKLY_STATS.map((day, idx) => {
      // Đối với ngày cuối cùng (Hôm nay), lấy dữ liệu thực tế từ state
      if (idx === WEEKLY_STATS.length - 1) {
        return {
          name: 'Today',
          study: day.studyMinutes,
          social: usage.reduce((sum, app) => sum + app.minutes, 0),
        };
      }
      return {
        name: day.date,
        study: day.studyMinutes,
        social: day.socialMinutes,
      };
    });
  }, [usage]);

  const handleAppClick = (app: AppUsage, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    setEditingApp(app);
    setNewLimit(app.limit);
  };

  const saveLimit = () => {
    if (editingApp) {
      setUsage(prev => prev.map(a => a.name === editingApp.name ? { ...a, limit: newLimit } : a));
      setEditingApp(null);
    }
  };

  const handleDeleteApp = (e: React.MouseEvent, appName: string) => {
    e.stopPropagation(); // Vẫn cần giữ cái này để không mở modal Edit
    // Thay vì window.confirm, ta set state để hiện Modal xác nhận
    setAppToDelete(appName);
  };
  const confirmDeleteAction = () => {
    if (appToDelete) {
      setUsage(prev => prev.filter(app => app.name.toLowerCase() !== appToDelete.toLowerCase()));
      
      // Nếu đang mở modal edit của app đó thì đóng luôn
      if (editingApp?.name.toLowerCase() === appToDelete.toLowerCase()) {
        setEditingApp(null);
      }
      
      // Reset state và đóng modal xóa
      setAppToDelete(null);
    }
  };

  const handleAddApp = () => {
    const trimmedName = addAppName.trim();
    if (!trimmedName) return;
    
    const appExists = usage.some(a => a.name.toLowerCase() === trimmedName.toLowerCase());
    if (appExists) {
        alert("Ứng dụng này đã được theo dõi rồi.");
        return;
    }

    const config = APP_CONFIG[trimmedName] || { icon: Smartphone, color: addAppColor };
    const newApp: AppUsage = {
        name: trimmedName,
        minutes: 0,
        limit: addAppLimit,
        icon: 'smartphone', 
        color: config.color || addAppColor
    };

    setUsage(prev => [...prev, newApp]);
    setShowAddModal(false);
    setAddAppName('');
    setAddAppLimit(60);
  };

  const filteredApps = usage.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl animate-in zoom-in-95">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest border-b border-white/10 pb-2">{label} Report</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold text-white/70">Focus Time</span>
              </div>
              <span className="text-sm font-black text-white">{payload[0].value}m</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-white/70">Social Usage</span>
              </div>
              <span className="text-sm font-black text-white">{payload[1].value}m</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-surface dark:bg-slate-950 transition-colors">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 z-0" />

      <div className="flex-1 overflow-y-auto no-scrollbar pb-40 px-6 pt-10 relative z-10">
        <div className="flex justify-between items-center mb-8 text-white px-2">
           <div>
              <h1 className="text-2xl font-black tracking-tight">Digital Pulse</h1>
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Analytics</p>
           </div>
           <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <BarChart3 size={20} />
           </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div className="bg-gradient-to-br from-rose-500 to-orange-600 p-5 rounded-[32px] text-white shadow-lg relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-3">
                 <Flame size={14} fill="white" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Consistency</span>
              </div>
              <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-black tracking-tighter">{focusStreak}</span>
                 <span className="text-[10px] font-bold opacity-70 uppercase tracking-tight">Days Streak</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                 <Target size={16} className="text-emerald-500" />
                 <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">{taskCompletionRate}%</span>
              </div>
              <div className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">
                 {completedTasksCount} / {totalTasks} Missions
              </div>
           </div>
        </div>

        {/* Activity Balance Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[36px] shadow-sm border border-slate-100 dark:border-slate-800 mb-6 overflow-hidden">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Allocation</h3>
                  <p className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Focus vs. Social</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[8px] font-black text-slate-400 uppercase">Focus</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-[8px] font-black text-slate-400 uppercase">Social</span>
                 </div>
              </div>
          </div>

          <div className="h-48 w-full relative -ml-4">
              <ResponsiveContainer width="110%" height="100%">
                  <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.5} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} 
                        dy={10} 
                      />
                      <YAxis hide />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.1 }} />
                      <Bar 
                        dataKey="study" 
                        fill="#8B5CF6" 
                        radius={[6, 6, 0, 0]} 
                        barSize={12}
                        animationDuration={1500}
                      />
                      <Bar 
                        dataKey="social" 
                        fill="#F43F5E" 
                        radius={[6, 6, 0, 0]} 
                        barSize={12}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                  </BarChart>
              </ResponsiveContainer>
          </div>
        </div>

        {/* Monitored Apps Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6 px-1">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-3">
                <Smartphone size={20} className="text-primary" />
                Tracked Apps
              </h3>
              <div className="flex gap-2">
                 <button onClick={() => setIsSearching(!isSearching)} className={`p-2 rounded-xl transition-all ${isSearching ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                    <Search size={18} />
                 </button>
                 <button onClick={() => setShowAddModal(true)} className="p-2 text-slate-400 hover:text-primary transition-all">
                    <Plus size={22} />
                 </button>
              </div>
          </div>

          {isSearching && (
              <div className="mb-6 animate-in slide-in-from-top-2">
                  <input 
                    autoFocus type="text" placeholder="Search apps..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all dark:text-white shadow-sm"
                  />
              </div>
          )}

          <div className="space-y-4">
              {filteredApps.map((app) => {
                const progress = Math.min(100, (app.minutes / app.limit) * 100);
                const isOverLimit = app.minutes > app.limit;
                const Icon = APP_CONFIG[app.name]?.icon || Smartphone;

                return (
                  <div 
                    key={app.name}
                    onClick={(e) => handleAppClick(app, e)}
                    className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6" style={{ backgroundColor: app.color }}>
                              <Icon size={24} />
                          </div>
                          <div>
                              <h4 className="font-black text-slate-800 dark:text-white text-sm">{app.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.minutes}m / {app.limit}m Limit</p>
                          </div>
                      </div>
                      <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                          <button 
                            // SỬA: Thêm onMouseDown để chặn sự kiện sớm hơn nếu cần
                            onClick={(e) => handleDeleteApp(e, app.name)} 
                            className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl active:scale-90 transition-transform cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/40"
                            title="Gỡ bỏ ứng dụng"
                            type="button" // SỬA: Luôn định nghĩa type cho button
                          >
                              <Trash2 size={18} />
                          </button>
                          
                          {/* Nút Edit chỉ mang tính minh họa vì click vào card đã là edit, nhưng nên để đó cho rõ UX */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400">
                              <Edit3 size={18} />
                          </div>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${isOverLimit ? 'bg-rose-500' : 'bg-primary'}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
              
              {filteredApps.length === 0 && (
                <div className="py-10 text-center">
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Không có ứng dụng nào được tìm thấy</p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Edit App Modal */}
      {editingApp && (
          <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 w-full sm:max-w-sm rounded-t-[40px] sm:rounded-[40px] p-6 sm:p-8 shadow-2xl animate-in slide-in-from-bottom-20 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col">
                  <div className="flex justify-between items-center mb-8 shrink-0">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{backgroundColor: editingApp.color}}>
                            {React.createElement(APP_CONFIG[editingApp.name]?.icon || Smartphone, { size: 28 })}
                         </div>
                         <h3 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">{editingApp.name}</h3>
                      </div>
                      <button onClick={() => setEditingApp(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <X size={20} className="text-slate-500" />
                      </button>
                  </div>

                  <div className="flex-1">
                      <div className="mb-10 text-center">
                          <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-2">Hạn mức hàng ngày</div>
                          <div className="flex items-baseline justify-center gap-2">
                            <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{newLimit}</div>
                            <span className="text-lg font-black text-primary">Phút</span>
                          </div>
                      </div>

                      <div className="px-2 mb-10">
                        <input type="range" min="5" max="240" step="5" value={newLimit} onChange={(e) => setNewLimit(Number(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-primary" />
                        <div className="flex justify-between mt-3 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            <span>5M</span>
                            <span>120M</span>
                            <span>240M</span>
                        </div>
                      </div>
                  </div>

                  <div className="space-y-3 pb-10 sm:pb-4 shrink-0 mt-4">
                    <button onClick={saveLimit} className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-lg active:scale-95 transition-all text-xs tracking-[0.2em] uppercase">
                        Cập nhật hạn mức
                    </button>
                    <button 
                      onClick={(e) => handleDeleteApp(e, editingApp.name)} 
                      className="w-full py-4 text-red-500 bg-red-50 dark:bg-red-900/20 font-black rounded-3xl active:scale-95 transition-all text-[10px] tracking-widest uppercase"
                    >
                        Dừng theo dõi
                    </button>
                  </div>
              </div>
          </div>
      )}

      {/* Add App Modal */}
      {showAddModal && (
          <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-20">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="font-black text-2xl text-slate-800 dark:text-white tracking-tight">Thêm nhiệm vụ</h3>
                      <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500"><X size={22} /></button>
                  </div>

                  <div className="space-y-6 mb-10 pb-6">
                      <div>
                          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">Tên ứng dụng</label>
                          <input 
                            autoFocus type="text" placeholder="Ví dụ: TikTok" value={addAppName}
                            onChange={(e) => setAddAppName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all dark:text-white"
                          />
                      </div>

                      <div className="flex flex-wrap gap-2">
                          {SUGGESTED_APPS.map(appName => (
                              <button key={appName} onClick={() => { setAddAppName(appName); setAddAppColor(APP_CONFIG[appName]?.color || '#8B5CF6'); }} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${addAppName === appName ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>{appName}</button>
                          ))}
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Màu thương hiệu</label>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(color => (
                                <button key={color} onClick={() => setAddAppColor(color)} className={`w-8 h-8 rounded-lg transition-all border-2 ${addAppColor === color ? 'border-primary scale-110' : 'border-transparent opacity-60'}`} style={{ backgroundColor: color }} />
                            ))}
                          </div>
                      </div>

                      <div>
                          <div className="flex justify-between mb-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hạn mức ban đầu</label>
                            <span className="text-sm font-black text-primary tabular-nums">{addAppLimit}ph</span>
                          </div>
                          <input type="range" min="5" max="240" step="5" value={addAppLimit} onChange={(e) => setAddAppLimit(Number(e.target.value))} className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none accent-primary" />
                      </div>
                  </div>

                  <button onClick={handleAddApp} disabled={!addAppName.trim()} className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl active:scale-95 transition-all text-xs tracking-widest uppercase disabled:opacity-40 mb-10">
                      Bắt đầu theo dõi
                  </button>
              </div>
          </div>
      )}
      {/* Delete Confirmation Modal - FIX CHO AI STUDIO */}
      {appToDelete && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                        <Trash2 size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Xóa ứng dụng?</h3>
                    <p className="text-sm text-slate-500 font-medium">
                        Bạn có chắc chắn muốn dừng theo dõi <span className="font-bold text-slate-800 dark:text-slate-300">"{appToDelete}"</span>? Dữ liệu thống kê của ứng dụng này sẽ bị mất.
                    </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setAppToDelete(null)}
                        className="py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl active:scale-95 transition-all"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={confirmDeleteAction}
                        className="py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/30 active:scale-95 transition-all"
                    >
                        Xóa ngay
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>

  );
};

export default StatsView;
