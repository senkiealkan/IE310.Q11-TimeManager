import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import FocusMode from './components/FocusMode';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import { Tab, Task, AppUsage, DailyStats } from './types';
import { INITIAL_TASKS, MOCK_USAGE, WEEKLY_STATS } from './constants';

const TODAY_STATS: DailyStats = {
    ...WEEKLY_STATS[WEEKLY_STATS.length - 1],
    xp: 450,
    level: 12,
    focusScore: 85 // Mock high score for testing boosts
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [usage, setUsage] = useState<AppUsage[]>(MOCK_USAGE);
  const [stats, setStats] = useState<DailyStats>(TODAY_STATS);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [focusSound, setFocusSound] = useState('rain');
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Student',
    major: 'Computer Science',
    birthDate: '2003-05-15',
    avatar: 'https://picsum.photos/200/200'
  });

  const XP_PER_LEVEL = 1000;

  const addXP = (amount: number) => {
    setStats(prev => {
        const bonus = prev.focusScore >= 80 ? 1.5 : 1.0;
        const totalAdd = Math.round(amount * bonus);
        let newXP = prev.xp + totalAdd;
        let newLevel = prev.level;

        if (newXP >= XP_PER_LEVEL) {
            newXP -= XP_PER_LEVEL;
            newLevel += 1;
            setShowLevelUp(true);
        }

        return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const handleFocusComplete = (minutes: number, taskId?: string) => {
    const xpGained = Math.round(minutes * 2);
    addXP(xpGained);
    
    setStats(prev => ({
      ...prev,
      studyMinutes: prev.studyMinutes + minutes,
      focusScore: Math.min(100, prev.focusScore + (taskId ? 15 : 10))
    }));

    if (taskId) {
        setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, completed: true } : t
        ));
    }
    setCurrentTab(Tab.HOME);
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.HOME:
        return (
          <Dashboard 
            tasks={tasks} 
            usage={usage} 
            stats={stats}
            onNavigate={setCurrentTab}
            onStartFocus={() => setCurrentTab(Tab.FOCUS)}
            onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t))}
            onQuickAddTask={(title) => setTasks(prev => [{id: Date.now().toString(), title, completed: false, category: 'Personal', priority: 'Medium', dueDate: new Date().toISOString().split('T')[0], durationMinutes: 30}, ...prev])}
            onCompleteQuest={(xp) => addXP(xp)}
          />
        );
      case Tab.TASKS:
        return <TaskList tasks={tasks} setTasks={setTasks} />;
      case Tab.FOCUS:
        return (
            <FocusMode 
                tasks={tasks}
                onExit={() => setCurrentTab(Tab.HOME)} 
                onComplete={handleFocusComplete}
                initialSound={focusSound}
                onSoundChange={setFocusSound}
            />
        );
      case Tab.STATS:
        return (
            <StatsView 
                usage={usage} 
                setUsage={setUsage} 
                tasks={tasks} 
                focusScore={stats.focusScore} 
            />
        );
      case Tab.PROFILE:
        return (
            <ProfileView 
                theme={theme} 
                onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
                notifsEnabled={notifsEnabled}
                onNotifsToggle={() => setNotifsEnabled(!notifsEnabled)}
                focusSound={focusSound}
                onSoundChange={setFocusSound}
                profile={userProfile}
                setProfile={setUserProfile}
                level={stats.level}
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-full w-full flex flex-col relative transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-surface text-slate-800'}`}>
      {renderContent()}

      {showLevelUp && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 text-center shadow-2xl animate-in zoom-in-95">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/40">
                      <span className="text-4xl">🎊</span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">LEVEL UP!</h2>
                  <p className="text-slate-500 font-bold mb-8">You've reached level {stats.level}</p>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-8 text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">New Unlock</p>
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">🎸</div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">New Focus Ambience Available</span>
                      </div>
                  </div>
                  <button 
                    onClick={() => setShowLevelUp(false)}
                    className="w-full py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black text-xs tracking-widest shadow-xl active:scale-95 transition-all"
                  >
                    CONTINUE JOURNEY
                  </button>
              </div>
          </div>
      )}

      {currentTab !== Tab.FOCUS && (
        <Navigation 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
          xp={stats.xp} 
          level={stats.level} 
        />
      )}
    </div>
  );
};

export default App;