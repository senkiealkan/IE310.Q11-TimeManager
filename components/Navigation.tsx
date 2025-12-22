
import React from 'react';
import { Home, CheckSquare, Zap, BarChart2, User } from 'lucide-react';
import { Tab } from '../types';

interface NavigationProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  const navItems = [
    { id: Tab.HOME, icon: Home, label: 'Home' },
    { id: Tab.TASKS, icon: CheckSquare, label: 'Tasks' },
    { id: Tab.FOCUS, icon: Zap, label: 'Focus', highlight: true },
    { id: Tab.STATS, icon: BarChart2, label: 'Stats' },
    { id: Tab.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-800/50 px-8 py-4 pb-8 flex justify-between items-center z-[100]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        
        if (item.highlight) {
            return (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className="relative flex items-center justify-center -mt-14 transition-transform active:scale-90"
                >
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all ${isActive ? 'bg-primary rotate-45 shadow-primary/40' : 'bg-slate-900 dark:bg-slate-700'}`}>
                        <Icon size={28} color="white" className={isActive ? '-rotate-45' : ''} fill={isActive ? "currentColor" : "none"} />
                    </div>
                </button>
            )
        }

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center transition-all duration-300 relative py-2 ${
              isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />}
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
