
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, X, CheckCircle2, ChevronDown, 
  CloudRain, Waves, AudioWaveform, Volume2, AlertTriangle, Zap,
  Music, Settings2, Trophy, ArrowRight, Brain, Clock
} from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { Task } from '../types';

interface FocusModeProps {
  tasks: Task[];
  onExit: () => void;
  // FIX: Corrected the syntax for the 'onComplete' function type. The parameter 'minutes' was missing a colon.
  onComplete: (minutes: number, taskId?: string) => void;
  initialSound: string;
  onSoundChange: (sound: string) => void;
}

const PRESETS = [
  { id: 'pomo', label: 'Pomodoro', minutes: 25 },
  { id: 'short', label: 'Short Break', minutes: 5 },
  { id: 'long', label: 'Long Break', minutes: 15 },
  { id: 'custom', label: 'Custom', minutes: 60 },
];

const FOCUS_QUOTES = [
  "Starve your distractions, feed your focus.",
  "One thing at a time. That is the whole art.",
  "Flow follows focus.",
  "Deep work is the superpower of the 21st century.",
  "Discipline is freedom.",
  "You don't find time, you make it."
];

const AMBIENCE_OPTIONS = [
  { id: 'silent', icon: Volume2, label: 'Silent', src: '' },
  { id: 'rain', icon: CloudRain, label: 'Rain', src: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3' },
  { id: 'stream', icon: Waves, label: 'Stream', src: 'https://assets.mixkit.co/sfx/preview/mixkit-river-stream-ambience-loop-1200.mp3' },
  { id: 'white_noise', icon: AudioWaveform, label: 'White Noise', src: 'https://assets.mixkit.co/sfx/preview/mixkit-static-humming-radio-2447.mp3' },
];

const MAX_FOCUS_MINUTES = 120;

const FocusMode: React.FC<FocusModeProps> = ({ tasks, onExit, onComplete, initialSound, onSoundChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState('pomo');
  const [volume, setVolume] = useState(0.5);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * FOCUS_QUOTES.length));

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastAngleRef = useRef<number | null>(null);

  const availableTasks = tasks.filter(t => !t.completed);
  const activeTask = tasks.find(t => t.id === selectedTaskId);
  
  // --- Audio Engine ---
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }
    const audio = audioRef.current;
    
    const selectedSound = AMBIENCE_OPTIONS.find(opt => opt.id === initialSound);
    if (initialSound === 'silent' || !selectedSound?.src) {
      audio.pause();
      return;
    }
    
    if (audio.src !== selectedSound.src) {
        audio.src = selectedSound.src;
    }

    if (isActive) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
    }
  }, [initialSound, isActive]);
  
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);
  
  // --- Timer Logic ---
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && isActive) {
      handleTimerComplete();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);
  
  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            toggleTimer();
        }
        if (e.code === 'Escape') {
            e.preventDefault();
            isActive ? setShowGiveUpConfirm(true) : onExit();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onExit]);

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
  };

  const toggleTimer = () => { if (timeLeft > 0) setIsActive(!isActive); };
  
  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    if (isActive) return;
    setSelectedPresetId(preset.id);
    setInitialTime(preset.minutes * 60);
    setTimeLeft(preset.minutes * 60);
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
  
  const getEndTime = () => {
      const endDate = new Date(Date.now() + timeLeft * 1000);
      return formatDate(endDate, 'p'); // e.g., "1:30 PM"
  };

  // --- Circular Slider Logic ---
  const handleInteractionMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current || !timerContainerRef.current || isActive) return;

    const rect = timerContainerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (lastAngleRef.current !== null) {
      if (lastAngleRef.current > 300 && angle < 60) angle = 360;
      else if (lastAngleRef.current < 60 && angle > 300) angle = 0;
    }
    lastAngleRef.current = angle;
    
    let minutes = Math.max(1, Math.round((angle / 360) * MAX_FOCUS_MINUTES));

    setInitialTime(minutes * 60);
    setTimeLeft(minutes * 60);
    setSelectedPresetId('custom');
  };

  const handleInteractionStart = (clientX: number, clientY: number) => {
    if (isActive) return;
    isDraggingRef.current = true;
    lastAngleRef.current = null;
    document.body.style.cursor = 'grabbing';
    handleInteractionMove(clientX, clientY);
  };
  
  const handleInteractionEnd = () => { 
      isDraggingRef.current = false;
      lastAngleRef.current = null;
      document.body.style.cursor = 'default';
  };

  useEffect(() => {
    const moveHandler = (e: MouseEvent) => handleInteractionMove(e.clientX, e.clientY);
    const touchMoveHandler = (e: TouchEvent) => handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', touchMoveHandler);
    window.addEventListener('mouseup', handleInteractionEnd);
    window.addEventListener('touchend', handleInteractionEnd);

    return () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', touchMoveHandler);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
      document.body.style.cursor = 'default';
    };
  }, [isActive]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const visualProgress = initialTime > 0 ? initialTime / (MAX_FOCUS_MINUTES * 60) : 0;
  const strokeDashoffset = circumference - visualProgress * circumference;
  
  const handleAngle = visualProgress * 360;
  const handleX = 144 + radius * Math.cos((handleAngle - 90) * Math.PI / 180);
  const handleY = 144 + radius * Math.sin((handleAngle - 90) * Math.PI / 180);

  if (isCompleted) {
    return (
      <div className="flex flex-col h-full bg-surface dark:bg-slate-950 items-center justify-center p-6 text-center transition-colors">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-2xl w-full max-w-sm">
           <Trophy size={60} className="text-yellow-500 mx-auto mb-6" />
           <h2 className="text-3xl font-black mb-2 dark:text-white">Session Clear!</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Focused for {Math.floor(initialTime / 60)} minutes.</p>
           <button 
             onClick={() => onComplete(initialTime / 60, selectedTaskId || undefined)}
             className="w-full py-5 bg-primary text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
           >
             CLAIM 50 XP
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface dark:bg-slate-950 text-slate-800 dark:text-white relative overflow-hidden transition-colors">
       <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-breathe {
          animation: breathe 4s infinite ease-in-out;
        }
      `}</style>
      <div className="relative z-20 px-6 py-8 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
           <Zap size={16} className={isActive ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
           <span className="font-black text-[10px] tracking-[0.2em] uppercase text-slate-400">Immersion</span>
        </div>
        <button 
            onClick={() => isActive ? setShowGiveUpConfirm(true) : onExit()} 
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800"
        >
            <X size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="min-h-full flex flex-col items-center justify-around p-6 pt-0 gap-6">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 text-center">"{FOCUS_QUOTES[quoteIndex]}"</p>

          <div className="relative w-full max-w-xs">
            <button 
                onClick={() => !isActive && setShowTaskSelector(!showTaskSelector)}
                disabled={isActive}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all shadow-sm ${
                isActive 
                    ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 cursor-not-allowed' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
            >
                <div className="flex items-center gap-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Zap size={16} />
                    </div>
                    <span className="text-sm font-bold truncate text-slate-700 dark:text-slate-200">
                        {activeTask ? activeTask.title : "Assign a Task"}
                    </span>
                </div>
                {!isActive && <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {showTaskSelector && !isActive && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                {availableTasks.map(task => (
                    <button
                    key={task.id}
                    onClick={() => { setSelectedTaskId(task.id); setShowTaskSelector(false); }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 flex items-center gap-2"
                    >
                    <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-400' : 'bg-blue-400'}`} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{task.title}</span>
                    </button>
                ))}
              </div>
            )}
          </div>

          <div 
              ref={timerContainerRef}
              onMouseDown={(e) => handleInteractionStart(e.clientX, e.clientY)}
              onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX, e.touches[0].clientY)}
              className={`relative flex items-center justify-center w-72 h-72 touch-none ${!isActive ? 'cursor-grab active:cursor-grabbing' : ''}`}
          >
              <svg className="w-full h-full" viewBox="0 0 288 288">
                  <circle transform="rotate(-90 144 144)" cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-900" />
                  <circle transform="rotate(-90 144 144)" cx="144" cy="144" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent"
                      strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                      className={`text-primary transition-all duration-300 ease-linear drop-shadow-xl ${isActive ? 'animate-breathe' : ''}`}
                  />
                  {!isActive && selectedPresetId === 'custom' && (
                      <g>
                          <circle cx={handleX} cy={handleY} r={12} fill="white" stroke="#8B5CF6" strokeWidth="3" className="drop-shadow-lg" />
                          <circle cx={handleX} cy={handleY} r={5} fill="#8B5CF6" />
                      </g>
                  )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-6xl font-black font-mono tracking-tighter">{formatTime(timeLeft)}</span>
                  <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mt-2">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{getEndTime()}</span>
                  </div>
              </div>
          </div>
          
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-full flex gap-1 animate-in fade-in">
              {PRESETS.map(p => (
                  <button 
                      key={p.id}
                      onClick={() => handlePresetClick(p)}
                      disabled={isActive}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-50 ${
                          selectedPresetId === p.id ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-slate-500 hover:bg-white/50'
                      }`}
                  >
                      {p.label}
                  </button>
              ))}
          </div>

          <div className="w-full max-w-xs">
              <button onClick={toggleTimer} className="w-full h-16 bg-primary text-white rounded-2xl font-black text-sm tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
                  {isActive ? <Pause size={18} fill="currentColor"/> : <Play size={18} fill="currentColor"/>}
                  {isActive ? 'PAUSE' : 'START FOCUS'}
              </button>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-6 shrink-0">
         <div className="flex items-center justify-between mb-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Ambience</span>
             {initialSound !== 'silent' && (
                 <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-20 accent-primary" />
             )}
         </div>
         <div className="flex gap-2">
            {AMBIENCE_OPTIONS.map((opt) => (
                <button key={opt.id} onClick={() => onSoundChange(opt.id)}
                    className={`flex-1 flex flex-col items-center py-4 rounded-2xl border transition-all ${initialSound === opt.id ? 'bg-primary border-primary text-white' : 'bg-transparent border-slate-100 dark:border-slate-800'}`}>
                    <opt.icon size={20} />
                    <span className="text-[8px] font-bold uppercase mt-2">{opt.label}</span>
                </button>
            ))}
         </div>
      </div>
      
      {showGiveUpConfirm && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl">
                  <div className="text-center">
                      <AlertTriangle size={32} className="text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-bold dark:text-white mb-2">Give up now?</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Giving up now will result in losing your current Streak. Are you sure?</p>
                  </div>
                  <div className="flex gap-3">
                      <button onClick={() => setShowGiveUpConfirm(false)} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">Keep Focusing</button>
                      <button onClick={handleGiveUp} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold">Yes, Quit</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default FocusMode;
