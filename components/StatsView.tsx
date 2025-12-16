import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DailyStats, AppUsage } from '../types';
import { WEEKLY_STATS } from '../constants';
import { Smartphone, BookOpen } from 'lucide-react';

interface StatsViewProps {
  usage: AppUsage[];
}

const StatsView: React.FC<StatsViewProps> = ({ usage }) => {
  const COLORS = usage.map(u => u.color);

  const totalUsage = usage.reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6 pt-6 bg-surface">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Insights</h1>

      {/* Weekly Trend */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            Study vs Social (Weekly)
        </h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_STATS}>
                    <XAxis dataKey="date" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        cursor={{fill: '#f1f5f9'}}
                    />
                    <Bar dataKey="studyMinutes" name="Study" stackId="a" fill="#8B5CF6" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="socialMinutes" name="Social" stackId="a" fill="#FDA4AF" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Social Apps Breakdown */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Smartphone size={16} className="text-red-400" />
            Distraction Sources
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={usage}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="minutes"
                        >
                            {usage.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800">{Math.floor(totalUsage / 60)}h</span>
                    <span className="text-xs text-slate-400">Total</span>
                </div>
            </div>

            <div className="w-full space-y-3">
                {usage.map((app, idx) => (
                    <div key={app.name} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{backgroundColor: app.color}}></div>
                            <span className="text-slate-600 font-medium">{app.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">{app.minutes}m</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
      
      {/* Heatmap Placeholder (Visual only) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
         <h3 className="text-sm font-bold text-slate-700 mb-4">Focus Intensity</h3>
         <div className="grid grid-cols-7 gap-1">
            {Array.from({length: 28}).map((_, i) => (
                <div 
                    key={i} 
                    className={`aspect-square rounded-md ${
                        Math.random() > 0.6 ? 'bg-primary' : Math.random() > 0.3 ? 'bg-primary/40' : 'bg-slate-100'
                    }`} 
                />
            ))}
         </div>
         <p className="text-xs text-slate-400 mt-2 text-center">Last 4 weeks</p>
      </div>
    </div>
  );
};

export default StatsView;