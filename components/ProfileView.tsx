
import React, { useState } from 'react';
import { 
  User, Settings, Award, ChevronRight, Bell, Moon, Sun, 
  Volume2, Users, X, Camera, Calendar, BookOpen, Save
} from 'lucide-react';
import { INITIAL_GOALS, BADGES, LINKED_ACCOUNTS } from '../constants';

interface ProfileViewProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  notifsEnabled: boolean;
  onNotifsToggle: () => void;
  focusSound: string;
  onSoundChange: (sound: string) => void;
  profile: any;
  setProfile: (p: any) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  theme, onThemeToggle, notifsEnabled, onNotifsToggle, focusSound, onSoundChange, profile, setProfile 
}) => {
  const [showBadges, setShowBadges] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

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
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                  5
              </div>
          </div>
          <div>
              <h2 className="text-xl font-bold dark:text-white">{profile.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{profile.major}</p>
              <button 
                onClick={() => setShowBadges(true)}
                className="flex items-center gap-1.5 mt-2 text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full w-fit hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                  <Award size={14} />
                  <span>3 / {BADGES.length} Badges</span>
                  <ChevronRight size={12} />
              </button>
          </div>
      </div>

      {/* Linked Accounts */}
      <div className="mb-8">
        <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Users size={14} /> Linked Accounts
        </h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {LINKED_ACCOUNTS.map(acc => (
                <div key={acc.id} className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-14 h-14 rounded-2xl border-2 border-white dark:border-slate-800 shadow-md overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all">
                        <img src={acc.avatar} alt={acc.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{acc.name}</span>
                </div>
            ))}
            <button className="w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 hover:text-primary transition-colors">
                <Users size={20} />
            </button>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden mb-8 transition-colors">
          <button 
            onClick={onNotifsToggle}
            className="w-full flex justify-between items-center p-5 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
              <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${notifsEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Bell size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Notifications</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase ${notifsEnabled ? 'text-blue-500' : 'text-slate-400'}`}>
                      {notifsEnabled ? 'Active' : 'Muted'}
                  </span>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${notifsEnabled ? 'bg-primary' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifsEnabled ? 'translate-x-4' : ''}`} />
                  </div>
              </div>
          </button>

          <button 
            onClick={onThemeToggle}
            className="w-full flex justify-between items-center p-5 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
              <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-yellow-100 text-yellow-600'}`}>
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Theme</span>
              </div>
              <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase text-slate-400">{theme}</span>
                  <ChevronRight size={16} className="text-slate-300" />
              </div>
          </button>

          <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Volume2 size={20} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Focus Sound</span>
              </div>
              <div className="flex gap-2">
                  {['rain', 'stream', 'white_noise'].map(s => (
                      <button 
                        key={s}
                        onClick={() => onSoundChange(s)}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                            focusSound === s 
                            ? 'bg-primary border-primary text-white shadow-lg' 
                            : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-600'
                        }`}
                      >
                          {s.replace('_', ' ')}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* Badges Modal */}
      {showBadges && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowBadges(false)}></div>
              <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 p-8">
                  <button onClick={() => setShowBadges(false)} className="absolute top-5 right-5 p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                      <X size={18} className="text-slate-600 dark:text-slate-400" />
                  </button>
                  <h3 className="text-2xl font-black dark:text-white mb-6">Badges</h3>
                  <div className="grid grid-cols-3 gap-4">
                      {BADGES.map(badge => (
                          <div key={badge.id} className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${badge.unlocked ? `${badge.color} scale-100 shadow-sm` : 'bg-slate-50 dark:bg-slate-800/50 grayscale opacity-40'}`}>
                              <span className="text-2xl">{badge.icon}</span>
                              <span className="text-[8px] font-bold text-center leading-tight">{badge.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowSettings(false)}></div>
              <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[32px] shadow-2xl relative animate-in slide-in-from-bottom-10 p-7">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="font-black text-xl dark:text-white">Edit Profile</h3>
                      <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                          <X size={18} className="text-slate-600 dark:text-slate-400" />
                      </button>
                  </div>
                  
                  <div className="space-y-6">
                      <div className="flex justify-center mb-4">
                          <div className="relative">
                              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-slate-100 dark:border-slate-800">
                                  <img src={tempProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                              <button className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl text-white shadow-lg">
                                  <Camera size={16} />
                              </button>
                          </div>
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Name</label>
                          <div className="relative">
                              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input 
                                type="text" 
                                value={tempProfile.name}
                                onChange={e => setTempProfile({...tempProfile, name: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Major</label>
                          <div className="relative">
                              <BookOpen size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input 
                                type="text" 
                                value={tempProfile.major}
                                onChange={e => setTempProfile({...tempProfile, major: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Birthday</label>
                          <div className="relative">
                              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input 
                                type="date" 
                                value={tempProfile.birthDate}
                                onChange={e => setTempProfile({...tempProfile, birthDate: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                              />
                          </div>
                      </div>
                  </div>

                  <button 
                    onClick={handleSaveSettings}
                    className="w-full mt-10 py-5 bg-primary text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                      <Save size={18} /> SAVE CHANGES
                  </button>
              </div>
          </div>
      )}
      
      <div className="text-center">
        <button className="text-red-400 text-xs font-black uppercase tracking-widest hover:text-red-500 transition-colors">Sign Out</button>
        <p className="text-[10px] text-slate-300 mt-4">FocusFlow v2.4.0</p>
      </div>
    </div>
  );
};

export default ProfileView;
