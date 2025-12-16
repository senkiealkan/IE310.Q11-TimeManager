import React from 'react';
import { User, Settings, Award, ChevronRight } from 'lucide-react';
import { INITIAL_GOALS } from '../constants';

const ProfileView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6 pt-6 bg-surface">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
          <button className="p-2 text-slate-400 hover:text-slate-600">
              <Settings size={24} />
          </button>
      </div>

      {/* User Card */}
      <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden">
               <img src="https://picsum.photos/200/200" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
              <h2 className="text-xl font-bold text-slate-800">Alex Student</h2>
              <p className="text-sm text-slate-500">Computer Science Major</p>
              <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full w-fit">
                  <Award size={12} />
                  <span>Level 5 Focus Master</span>
              </div>
          </div>
      </div>

      {/* Goals */}
      <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Current Goals</h3>
      <div className="space-y-4 mb-8">
          {INITIAL_GOALS.map(goal => (
              <div key={goal.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-800">{goal.title}</span>
                      <span className="text-xs font-bold text-primary">{goal.current} / {goal.target} {goal.unit}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{width: `${(goal.current / goal.target) * 100}%`}} 
                        className="h-full bg-secondary rounded-full"
                      ></div>
                  </div>
              </div>
          ))}
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {[
              { label: 'Notifications', value: 'On' },
              { label: 'Theme', value: 'Light' },
              { label: 'Focus Sound', value: 'Rain' },
              { label: 'Linked Accounts', value: '2' },
          ].map((item, i) => (
              <button key={i} className="w-full flex justify-between items-center p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">{item.value}</span>
                      <ChevronRight size={16} className="text-slate-300" />
                  </div>
              </button>
          ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="text-red-400 text-sm font-medium hover:text-red-500">Sign Out</button>
      </div>
    </div>
  );
};

export default ProfileView;