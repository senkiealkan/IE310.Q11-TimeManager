import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import FocusMode from './components/FocusMode';
import StatsView from './components/StatsView';
import ProfileView from './components/ProfileView';
import { Tab, Task, AppUsage, DailyStats } from './types';
import { INITIAL_TASKS, MOCK_USAGE, WEEKLY_STATS } from './constants';

// Get today's stats from mock data (typically this would be dynamic)
const TODAY_STATS: DailyStats = WEEKLY_STATS[WEEKLY_STATS.length - 1];

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  // In a real app, usage would come from an API or tracking service
  const [usage] = useState<AppUsage[]>(MOCK_USAGE);
  const [stats, setStats] = useState<DailyStats>(TODAY_STATS);

  const handleFocusComplete = (minutes: number, taskId?: string) => {
    // 1. Update Stats
    setStats(prev => ({
      ...prev,
      studyMinutes: prev.studyMinutes + minutes,
      focusScore: Math.min(100, prev.focusScore + (taskId ? 15 : 10)) // Bonus points for linked task
    }));

    // 2. Mark task as complete if linked
    if (taskId) {
        setTasks(prev => prev.map(t => 
            t.id === taskId ? { ...t, completed: true } : t
        ));
        // Optional: Show a success toast or alert here
        alert(`Great job! Session complete and +${minutes} mins added.`);
    } else {
        alert("Focus session complete!");
    }
    
    // 3. Return to dashboard
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
            />
        );
      case Tab.STATS:
        return <StatsView usage={usage} />;
      case Tab.PROFILE:
        return <ProfileView />;
      default:
        return <Dashboard tasks={tasks} usage={usage} stats={stats} onNavigate={setCurrentTab} onStartFocus={() => setCurrentTab(Tab.FOCUS)} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-surface">
      {/* Content Area */}
      {renderContent()}

      {/* Navigation (Hidden in Focus Mode) */}
      {currentTab !== Tab.FOCUS && (
        <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
      )}
    </div>
  );
};

export default App;