
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import FocusMode from './components/FocusMode';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import { Tab, Task, AppUsage, DailyStats } from './types';
import { INITIAL_TASKS, MOCK_USAGE, WEEKLY_STATS } from './constants';

const TODAY_STATS: DailyStats = WEEKLY_STATS[WEEKLY_STATS.length - 1];

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [usage] = useState<AppUsage[]>(MOCK_USAGE);
  const [stats, setStats] = useState<DailyStats>(TODAY_STATS);
  
  // Theme and Settings State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [focusSound, setFocusSound] = useState('rain');
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Student',
    major: 'Computer Science',
    birthDate: '2003-05-15',
    avatar: 'https://picsum.photos/200/200'
  });

  const handleFocusComplete = (minutes: number, taskId?: string) => {
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
        return <StatsView usage={usage} />;
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
            />
        );
      default:
        return <Dashboard tasks={tasks} usage={usage} stats={stats} onNavigate={setCurrentTab} onStartFocus={() => setCurrentTab(Tab.FOCUS)} onToggleTask={() => {}} onQuickAddTask={() => {}} />;
    }
  };

  return (
    <div className={`h-full w-full flex flex-col relative transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-surface text-slate-800'}`}>
      {renderContent()}

      {currentTab !== Tab.FOCUS && (
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      )}
    </div>
  );
};

export default App;
