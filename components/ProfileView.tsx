
import React, { useState } from 'react';
import { 
  Settings, Award, ChevronRight, Moon, Sun, 
  Volume2, Flame, X, Camera, User, Briefcase, Save, Lock
} from 'lucide-react';
import { BADGES } from '../constants';

interface ProfileViewProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  notifsEnabled: boolean;
  onNotifsToggle: () => void;
  focusSound: string;
  onSoundChange: (sound: string) => void;
  profile: {
    name: string;
    major: string;
    avatar: string;
  };
  setProfile: (p: any) => void;
  streak: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  theme, onThemeToggle, focusSound, onSoundChange, profile, setProfile, streak 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [selectedBadge, setSelectedBadge] = useState<typeof BADGES[0] | null>(null);

  const SOUND_OPTIONS = [
      { id: 'rain', label: 'Rain' },
      { id: 'stream', label: 'Stream' },
      { id: 'white_noise', label: 'White Noise' },
      { id: 'forest', label: 'Forest' },
      { id: 'lofi', label: 'Lo-fi' },
  ];

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-10 bg-[#F8FAFC] dark:bg-slate-950 transition-colors relative">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black dark:text-white">Profile</h1>
          <button 
            onClick={() => {
                setTempProfile(profile);
                setIsEditing(true);
            }}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all active:scale-90"
          >
              <Settings size={20} />
          </button>
      </div>

      {/* User Card */}
      <div className="flex flex-col items-center mb-6 text-center">
          <div className="relative mb-4">
              <div className="w-24 h-24 rounded-[32px] bg-slate-200 border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden">
                  <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-2xl shadow-lg border-2 border-white dark:border-slate-950">
                  <Flame size={16} fill="currentColor" />
              </div>
          </div>
          <h2 className="text-2xl font-black dark:text-white">{profile.name}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">{profile.major}</p>
          
          <div className="mt-4 inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-800/50">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-black text-orange-700 dark:text-orange-400">{streak} Day Streak</span>
          </div>
      </div>

      {/* Badges / Achievements Section */}
      <div className="mb-8">
          <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Achievements</h3>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{BADGES.filter(b => b.unlocked).length}/{BADGES.length} Unlocked</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
              {BADGES.map((badge) => (
                  <button 
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className={`relative flex flex-col items-center p-3 rounded-[28px] transition-all active:scale-95 ${
                        badge.unlocked 
                        ? `${badge.color} dark:bg-opacity-20 shadow-sm border border-white dark:border-slate-800` 
                        : 'bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                    }`}
                  >
                      <span className={`text-2xl mb-1 ${!badge.unlocked && 'grayscale'}`}>{badge.icon}</span>
                      <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter truncate w-full text-center">
                          {badge.name}
                      </span>
                      {!badge.unlocked && (
                          <div className="absolute top-1 right-1">
                              <Lock size={10} className="text-slate-400" />
                          </div>
                      )}
                  </button>
              ))}
          </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Volume2 size={20} className="text-primary" />
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Atmosphere</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      {SOUND_OPTIONS.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => onSoundChange(s.id)}
                            className={`flex items-center justify-center py-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${
                                focusSound === s.id 
                                ? 'bg-primary border-primary text-white shadow-lg' 
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500'
                            }`}
                          >
                              {s.label}
                          </button>
                      ))}
                  </div>
              </div>

              <button 
                onClick={onThemeToggle}
                className="w-full flex justify-between items-center p-6 border-t border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                  <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-yellow-100 text-yellow-600'}`}>
                        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                      </div>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Theme</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-slate-400">{theme}</span>
                      <ChevronRight size={16} className="text-slate-300" />
                  </div>
              </button>
          </div>
      </div>

      <div className="mt-8 text-center pb-10">
          <button className="text-red-400 text-xs font-black uppercase tracking-widest">Sign Out</button>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
          <div className="absolute inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 w-full max-w-xs shadow-2xl text-center animate-in zoom-in-95">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 ${selectedBadge.color} bg-opacity-30`}>
                      {selectedBadge.icon}
                  </div>
                  <h3 className="text-xl font-black dark:text-white mb-2">{selectedBadge.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                      {selectedBadge.description}
                  </p>
                  <button 
                    onClick={() => setSelectedBadge(null)}
                    className="w-full py-4 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl uppercase tracking-widest text-xs"
                  >
                      Close Intel
                  </button>
              </div>
          </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="absolute inset-0 z-[110] bg-slate-900/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <h3 className="font-black text-2xl dark:text-white">Edit Profile</h3>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                    {/* Avatar Edit */}
                    <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-xl">
                                <img src={tempProfile.avatar} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <Camera size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="w-full">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Avatar URL</label>
                            <div className="relative">
                                <Camera size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    type="text" 
                                    value={tempProfile.avatar} 
                                    onChange={(e) => setTempProfile({...tempProfile, avatar: e.target.value})}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all dark:text-white"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Name Edit */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Display Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input 
                                type="text" 
                                value={tempProfile.name} 
                                onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all dark:text-white"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    {/* Major Edit */}
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Major / Occupation</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input 
                                type="text" 
                                value={tempProfile.major} 
                                onChange={(e) => setTempProfile({...tempProfile, major: e.target.value})}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold outline-none focus:border-primary transition-all dark:text-white"
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 shrink-0">
                    <button 
                        onClick={handleSave}
                        className="w-full py-5 bg-primary text-white font-black rounded-3xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <Save size={18} />
                        SAVE CHANGES
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
