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
    focusScore: 82
};

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [usage, setUsage] = useState<AppUsage[]>(MOCK_USAGE);
  const [stats, setStats] = useState<DailyStats>(TODAY_STATS);
  const [streakCount] = useState(7);
  const [selectedFocusTaskId, setSelectedFocusTaskId] = useState<string | undefined>(undefined);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [focusSound, setFocusSound] = useState('rain');
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Alex',
    major: 'Computer Science',
    avatar: 'https://picsum.photos/200/200'
  });

  // Sync theme state with document class for Tailwind 'dark' variants
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleStartFocus = (taskId?: string) => {
    setSelectedFocusTaskId(taskId);
    setCurrentTab(Tab.FOCUS);
  };

  const handleFocusComplete = (minutes: number, taskId?: string) => {
    setStats(prev => ({
      ...prev,
      studyMinutes: prev.studyMinutes + minutes,
      focusScore: Math.min(100, prev.focusScore + 5)
    }));

    const idToComplete = taskId || selectedFocusTaskId;
    if (idToComplete) {
        setTasks(prev => prev.map(t => t.id === idToComplete ? { ...t, completed: true } : t));
    }
    
    setSelectedFocusTaskId(undefined);
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
            streak={streakCount}
            onNavigate={setCurrentTab}
            onStartFocus={handleStartFocus}
            onToggleTask={(id) => setTasks(prev => prev.map(t => t.id === id ? {...t, completed: !t.completed} : t))}
            onQuickAddTask={(title) => setTasks(prev => [{id: Date.now().toString(), title, completed: false, category: 'Personal', priority: 'Medium', dueDate: new Date().toISOString().split('T')[0], durationMinutes: 30}, ...prev])}
            onCompleteQuest={(points) => setStats(prev => ({...prev, focusScore: Math.min(100, prev.focusScore + points)}))}
          />
        );
      case Tab.TASKS:
        return <TaskList tasks={tasks} setTasks={setTasks} />;
      case Tab.FOCUS:
        return (
            <FocusMode 
                tasks={tasks}
                onExit={() => { setSelectedFocusTaskId(undefined); setCurrentTab(Tab.HOME); }} 
                onComplete={handleFocusComplete}
                initialSound={focusSound}
                onSoundChange={setFocusSound}
                activeTaskId={selectedFocusTaskId}
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
                streak={streakCount}
            />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-full w-full flex flex-col relative transition-colors duration-500 ${theme === 'dark' ? 'dark bg-slate-950 text-white' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {renderContent()}

      {currentTab !== Tab.FOCUS && (
        <Navigation 
          currentTab={currentTab} 
          onTabChange={setCurrentTab} 
        />
      )}
    </div>
  );
};

export default App;