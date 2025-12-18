
import React, { useState } from 'react';
import { 
  User, Settings, Award, ChevronRight, Bell, Moon, Sun, 
  Volume2, X, Camera, Calendar, BookOpen, Save, Lock
} from 'lucide-react';
import { BADGES } from '../constants';

interface ProfileViewProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  notifsEnabled: boolean;
  onNotifsToggle: () => void;
  focusSound: string;
  onSoundChange: (sound: string) => void;
  profile: any;
  setProfile: (p: any) => void;
  level: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  theme, onThemeToggle, notifsEnabled, onNotifsToggle, focusSound, onSoundChange, profile, setProfile, level 
}) => {
  const [showBadges, setShowBadges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const SOUND_UNLOCKS = [
      { id: 'rain', label: 'Rain', level: 1 },
      { id: 'stream', label: 'Stream', level: 3 },
      { id: 'white_noise', label: 'White Noise', level: 5 },
      { id: 'forest', label: 'Forest', level: 10 },
      { id: 'lofi', label: 'Lo-fi', level: 15 },
  ];

  const handleSaveSettings = () => {
    setProfile(tempProfile);
    setShowSettings(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6 bg-surface dark:bg-slate-950 transition-colors">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold dark:text-white">Profile</h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
              <Settings size={24} />
          </button>
      </div>

      {/* User Card */}
      <div className="flex items-center gap-5 mb-8">
          <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-slate-200 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
                  <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs text-white font-black">
                  {level}
              </div>
          </div>
          <div>
              <h2 className="text-xl font-bold dark:text-white">{profile.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{profile.major}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-full uppercase">Elite Member</span>
                <span className="text-[10px] font-black text-slate-400">LVL {level}</span>
              </div>
          </div>
      </div>

      {/* Unlocks & Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 transition-colors">
          <div className="p-5 border-b border-slate-50 dark:border-slate-800/50">
              <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Volume2 size={20} />
                  </div>
                  <div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sound Library</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Level up to unlock</p>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  {SOUND_UNLOCKS.map(s => {
                      const isLocked = level < s.level;
                      return (
                          <button 
                            key={s.id}
                            disabled={isLocked}
                            onClick={() => onSoundChange(s.id)}
                            className={`relative flex items-center justify-center py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                focusSound === s.id 
                                ? 'bg-primary border-primary text-white shadow-lg' 
                                : isLocked 
                                    ? 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                            }`}
                          >
                              {isLocked && <Lock size={10} className="mr-1.5" />}
                              {s.label}
                              {isLocked && <span className="absolute -top-1 -right-1 bg-slate-400 text-white px-1 rounded text-[7px]">LVL {s.level}</span>}
                          </button>
                      );
                  })}
              </div>
          </div>

          <button 
            onClick={onThemeToggle}
            className="w-full flex justify-between items-center p-5 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
              <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-yellow-100 text-yellow-600'}`}>
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">App Theme</span>
              </div>
              <div className="flex items-center gap-3">
                  {level < 10 && <Lock size={12} className="text-slate-300" />}
                  <span className="text-[10px] font-black uppercase text-slate-400">{theme}</span>
                  <ChevronRight size={16} className="text-slate-300" />
              </div>
          </button>
      </div>

      {/* Badges Modal & Settings Modal remain largely same... */}
      <div className="text-center px-6">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
              <Award size={24} className="text-amber-500 mx-auto mb-2" />
              <h4 className="text-xs font-black dark:text-white uppercase tracking-widest mb-1">Focus Legend Status</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Complete 50 more missions to achieve Master rank.</p>
          </div>
          <button className="text-red-400 text-xs font-black uppercase tracking-widest hover:text-red-500 transition-colors">Sign Out</button>
      </div>
    </div>
  );
};

export default ProfileView;
