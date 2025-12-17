import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, X, CheckCircle2, ChevronDown, 
  CloudRain, Coffee, Trees, Volume2, AlertTriangle, Zap 
} from 'lucide-react';
import { Task } from '../types';

interface FocusModeProps {
  tasks: Task[];
  onExit: () => void;
  onComplete: (minutes: number, taskId?: string) => void;
}

const PRESETS = [
  { label: 'Pomodoro', minutes: 25 },
  { label: 'Short Break', minutes: 5 },
  { label: 'Deep Dive', minutes: 60 },
];

const AMBIENCE_OPTIONS = [
  { id: 'silent', icon: Volume2, label: 'Silent' },
  { id: 'rain', icon: CloudRain, label: 'Rain' },
  { id: 'cafe', icon: Coffee, label: 'Cafe' },
  { id: 'forest', icon: Trees, label: 'Forest' },
];

const FocusMode: React.FC<FocusModeProps> = ({ tasks, onExit, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [ambience, setAmbience] = useState('silent');
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter only incomplete tasks for selection
  const availableTasks = tasks.filter(t => !t.completed);
  const activeTask = tasks.find(t => t.id === selectedTaskId);

  // Timer Logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer Finished
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);
      onComplete(initialTime / 60, selectedTaskId || undefined);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, initialTime, onComplete, selectedTaskId]);

  const toggleTimer = () => setIsActive(!isActive);

  const handlePresetClick = (minutes: number) => {
    if (isActive) return; // Prevent changing while running
    setInitialTime(minutes * 60);
    setTimeLeft(minutes * 60);
  };

  const handleGiveUp = () => {
    setIsActive(false);
    setShowGiveUpConfirm(false);
    onExit();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circular Progress Calculations
  // SVG size is 288x288 (r=120, cx=144, cy=144).
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = ((initialTime - timeLeft) / initialTime);
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative overflow-hidden">
      {/* CSS Animation for Breathing Effect */}
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.85; }
        }
        .animate-breathe {
          animation: breathe 4s infinite ease-in-out;
        }
      `}</style>

      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e1b4b] transition-all duration-1000 ${isActive ? 'opacity-100' : 'opacity-80'}`} />
        {isActive && (
           <div className="absolute inset-0 bg-primary/5 mix-blend-overlay animate-pulse" />
        )}
      </div>

      {/* Header (Fixed) */}
      <div className="relative z-20 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
           <Zap size={18} className="text-amber-400 fill-amber-400" />
           <span className="font-bold text-sm tracking-widest uppercase text-slate-300">Deep Work</span>
        </div>
        <button 
          onClick={() => isActive ? setShowGiveUpConfirm(true) : onExit()} 
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} className="text-slate-300" />
        </button>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full relative z-10">
        <div className="min-h-full flex flex-col items-center justify-center py-6 px-6 gap-6">
            
            {/* Task Selector */}
            <div className="w-full max-w-xs relative z-30">
            <button 
                onClick={() => !isActive && setShowTaskSelector(!showTaskSelector)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive 
                    ? 'bg-slate-800/50 border-slate-700 cursor-default' 
                    : 'bg-white/10 border-white/10 hover:bg-white/15 cursor-pointer'
                }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activeTask ? 'bg-primary' : 'bg-slate-700'}`}>
                    {activeTask ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                </div>
                <div className="flex flex-col items-start min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Focusing On</span>
                    <span className="text-sm font-medium truncate w-full text-left">
                        {activeTask ? activeTask.title : "Select a Task"}
                    </span>
                </div>
                </div>
                {!isActive && <ChevronDown size={16} className="text-slate-400 ml-2" />}
            </button>

            {/* Task Dropdown */}
            {showTaskSelector && !isActive && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                {availableTasks.length > 0 ? availableTasks.map(task => (
                    <button
                    key={task.id}
                    onClick={() => {
                        setSelectedTaskId(task.id);
                        setShowTaskSelector(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-700 border-b border-slate-700/50 last:border-0 flex items-center gap-2"
                    >
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-400' : 'bg-blue-400'}`} />
                    <span className="text-sm text-slate-200">{task.title}</span>
                    </button>
                )) : (
                    <div className="p-4 text-center text-xs text-slate-500">No pending tasks</div>
                )}
                </div>
            )}
            </div>

            {/* Visual Timer */}
            <div className={`relative flex items-center justify-center ${isActive ? 'animate-breathe' : ''}`}>
                {/* Outer Glow */}
                {isActive && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl transform scale-110" />
                )}
                
                {/* Responsive Container for SVG */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 288 288">
                        {/* Track */}
                        <circle
                            cx="144"
                            cy="144"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-slate-800"
                        />
                        {/* Progress */}
                        <circle
                            cx="144"
                            cy="144"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="text-primary transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-white drop-shadow-lg">
                        {formatTime(timeLeft)}
                        </span>
                        <span className={`text-sm font-medium tracking-[0.2em] mt-2 uppercase ${isActive ? 'text-primary animate-pulse' : 'text-slate-500'}`}>
                        {isActive ? 'In Zone' : 'Ready'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Presets (Only show when inactive) */}
            {!isActive ? (
            <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[32px]">
                {PRESETS.map((preset) => (
                <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset.minutes)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                    initialTime === preset.minutes * 60
                        ? 'bg-white text-slate-900 border-white'
                        : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500'
                    }`}
                >
                    {preset.label}
                </button>
                ))}
            </div>
            ) : (
                <div className="h-8"></div> // Spacer to keep layout stable
            )}

            {/* Primary Controls */}
            <div className="w-full max-w-xs flex flex-col items-center gap-4">
            {isActive ? (
                <div className="flex gap-4 w-full">
                    <button 
                    onClick={toggleTimer}
                    className="flex-1 h-14 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-900 rounded-2xl font-bold text-sm tracking-wide uppercase shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2"
                    >
                    <Pause fill="currentColor" size={18} /> Pause
                    </button>
                    <button 
                    onClick={() => setShowGiveUpConfirm(true)}
                    className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-2xl font-bold text-sm tracking-wide uppercase border border-slate-700 transition-all flex items-center justify-center"
                    >
                    Give Up
                    </button>
                </div>
            ) : (
                <button 
                    onClick={toggleTimer}
                    className="w-full h-14 bg-primary hover:bg-purple-500 active:scale-95 text-white rounded-2xl font-bold text-lg tracking-wide uppercase shadow-lg shadow-primary/40 transition-all flex items-center justify-center gap-2"
                >
                    <Play fill="currentColor" size={20} /> Start Focus
                </button>
            )}
            </div>
            
            {/* Scroll Padding */}
            <div className="h-4 shrink-0"></div>
        </div>
      </div>

      {/* Ambience Picker (Fixed Bottom) */}
      <div className="h-20 bg-slate-950/50 backdrop-blur-md border-t border-white/5 flex items-center justify-center gap-6 relative z-20 shrink-0">
         {AMBIENCE_OPTIONS.map((opt) => {
           const Icon = opt.icon;
           const isSelected = ambience === opt.id;
           return (
             <button
               key={opt.id}
               onClick={() => setAmbience(opt.id)}
               className={`flex flex-col items-center gap-1 transition-all ${isSelected ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}
             >
                <div className={`p-2 rounded-full ${isSelected ? 'bg-white/10' : ''}`}>
                  <Icon size={20} className={isSelected ? 'text-primary' : 'text-white'} />
                </div>
                <span className="text-[10px] font-medium">{opt.label}</span>
             </button>
           );
         })}
      </div>

      {/* Give Up Confirmation Modal */}
      {showGiveUpConfirm && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform scale-100">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
                 <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Give up now?</h3>
              <p className="text-slate-400 text-center text-sm mb-6">
                 You will lose your streak and the points for this session. Are you sure you want to stop?
              </p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowGiveUpConfirm(false)}
                   className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-semibold text-sm hover:bg-slate-600 transition-colors"
                 >
                   Keep Focusing
                 </button>
                 <button 
                   onClick={handleGiveUp}
                   className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-semibold text-sm hover:bg-red-500/20 transition-colors"
                 >
                   Yes, Quit
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FocusMode;