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
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 pb-5 flex justify-between items-center z-50">
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
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isActive ? 'bg-primary ring-4 ring-purple-100' : 'bg-slate-800'}`}>
                        <Icon size={24} color="white" fill={isActive ? "currentColor" : "none"} />
                    </div>
                    <span className="text-xs font-medium mt-1 text-slate-600">{item.label}</span>
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
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;