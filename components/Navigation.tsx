
import React from 'react';
import { Home, CheckSquare, Zap, BarChart2, User } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  xp?: number;
  level?: number;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange, xp = 0, level = 1 }) => {
  const navItems = [
    { id: Tab.HOME, icon: Home, label: 'Home' },
    { id: Tab.TASKS, icon: CheckSquare, label: 'Tasks' },
    { id: Tab.FOCUS, icon: Zap, label: 'Focus', highlight: true },
    { id: Tab.STATS, icon: BarChart2, label: 'Stats' },
    { id: Tab.PROFILE, icon: User, label: 'Profile' },
  ];

  const xpProgress = (xp / 1000) * 100;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-2 pb-5 flex justify-between items-center z-50">
      {/* Mini XP Bar top of Nav */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800">
        <div 
          className="h-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" 
          style={{ width: `${xpProgress}%` }}
        />
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        
        if (item.highlight) {
            return (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className="flex flex-col items-center justify-center -mt-8"
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-primary ring-4 ring-purple-100 dark:ring-purple-900/30' : 'bg-slate-800'}`}>
                        <Icon size={24} color="white" fill={isActive ? "currentColor" : "none"} />
                    </div>
                    <span className="text-[10px] font-black mt-1 text-slate-600 dark:text-slate-400 uppercase tracking-tighter">LVL {level}</span>
                </button>
            )
        }

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-colors duration-200 ${
              isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
