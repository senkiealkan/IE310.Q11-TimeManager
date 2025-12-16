import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Lock, Unlock, X } from 'lucide-react';

interface FocusModeProps {
  onExit: () => void;
  onComplete: (minutes: number) => void;
}

const FocusMode: React.FC<FocusModeProps> = ({ onExit, onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [isLocked, setIsLocked] = useState(false); // Simulates app blocking
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout to resolve type error in browser environment
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsActive(false);
      
      if (mode === 'FOCUS') {
          // Play sound or vibrate
          onComplete(initialTime / 60);
          alert("Focus session complete! Take a break.");
          setMode('BREAK');
          setTimeLeft(5 * 60);
          setInitialTime(5 * 60);
      } else {
          alert("Break over! Ready to focus again?");
          setMode('FOCUS');
          setTimeLeft(25 * 60);
          setInitialTime(25 * 60);
      }
      setIsLocked(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, onComplete, initialTime]);

  const toggleTimer = () => {
      setIsActive(!isActive);
      if (!isActive) {
          // Starting the timer
          setIsLocked(true);
      }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
    setIsLocked(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  return (
    <div className={`flex flex-col h-full bg-slate-900 text-white relative transition-colors duration-700 ${mode === 'BREAK' ? 'bg-teal-900' : ''}`}>
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-primary rounded-full blur-[80px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[80px]"></div>
      </div>

      {/* Header */}
      <div className="p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
            {isLocked ? <Lock size={18} className="text-red-400" /> : <Unlock size={18} className="text-green-400" />}
            <span className="text-sm font-medium tracking-wider uppercase opacity-70">
                {isLocked ? 'Apps Blocked' : 'Focus Mode'}
            </span>
        </div>
        <button onClick={onExit} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X size={20} />
        </button>
      </div>

      {/* Main Timer UI */}
      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            {/* Circular Progress (SVG) */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                />
                <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 120}
                    strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                    strokeLinecap="round"
                    className={`${mode === 'FOCUS' ? 'text-primary' : 'text-teal-400'} transition-all duration-1000 ease-linear`}
                />
            </svg>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold font-mono tracking-tighter tabular-nums text-white drop-shadow-lg">
                    {formatTime(timeLeft)}
                </div>
                <div className="text-white/50 text-sm font-medium mt-2 uppercase tracking-widest">
                    {isActive ? (mode === 'FOCUS' ? 'Stay Focused' : 'Rest Time') : 'Ready?'}
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="flex gap-6 items-center">
            <button 
                onClick={resetTimer}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white/70"
            >
                <RotateCcw size={20} />
            </button>

            <button 
                onClick={toggleTimer}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transform active:scale-95 transition-all ${
                    isActive ? 'bg-amber-400 text-slate-900' : 'bg-primary text-white'
                }`}
            >
                {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            
            <div className="w-12 h-12"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Motivational Toast */}
      {isActive && mode === 'FOCUS' && (
          <div className="p-8 text-center animate-pulse">
              <p className="text-white/80 font-medium">"Don't stop until you're proud."</p>
          </div>
      )}
    </div>
  );
};

export default FocusMode;