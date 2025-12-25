
import React from 'react';
import { 
  CheckCircle2, Circle, Calendar, ListTree, MoreHorizontal,
  BookOpen, User, Briefcase, Heart, Layers, Clock
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isValid } from 'date-fns';
import { Task, TaskWithDetails, Subtask } from '../types';

// Extended Types and Config moved to types.ts

type CategoryKey = 'Study' | 'Personal' | 'Project' | 'Health' | 'Work';

interface CategoryStyle {
  label: string;
  colors: string; 
  border: string;
  icon: React.ElementType;
}

const CATEGORY_CONFIG: Record<CategoryKey | string, CategoryStyle> = {
  Study: { label: 'Study', colors: 'bg-purple-100 text-purple-700', border: 'border-purple-200', icon: BookOpen },
  Personal: { label: 'Personal', colors: 'bg-blue-100 text-blue-700', border: 'border-blue-200', icon: User },
  Project: { label: 'Project', colors: 'bg-amber-100 text-amber-700', border: 'border-amber-200', icon: Layers },
  Health: { label: 'Health', colors: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200', icon: Heart },
  Work: { label: 'Work', colors: 'bg-indigo-100 text-indigo-700', border: 'border-indigo-200', icon: Briefcase }
};

const parseLocalISO = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.split('-');
  if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Date(dateStr);
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case 'High': return 'border-l-4 border-l-red-500 bg-red-50/30';
    case 'Medium': return 'border-l-4 border-l-orange-400 bg-orange-50/30';
    case 'Low': return 'border-l-4 border-l-blue-400 bg-blue-50/30';
    default: return 'border-l-4 border-l-slate-200';
  }
};

const getCheckboxColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-blue-500';
      default: return 'text-slate-300';
    }
};

const formatDateForDisplay = (isoString: string) => {
    const date = parseLocalISO(isoString);
    if (!isValid(date)) return isoString;
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date) && !isToday(date)) return format(date, 'MMM d');
    return format(date, 'MMM d');
};

interface TaskCardProps {
    task: TaskWithDetails;
    onClick: () => void;
    onToggle: (id: string, event?: React.MouseEvent) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onToggle }) => {
    const isOverdue = !task.completed && isPast(parseLocalISO(task.dueDate)) && !isToday(parseLocalISO(task.dueDate));
    const totalSub = task.subtasks?.length || 0;
    const completedSub = task.subtasks?.filter(s => s.completed).length || 0;
    const subtaskProgress = totalSub > 0 ? (completedSub / totalSub) * 100 : 0;
    
    const catConfig = CATEGORY_CONFIG[task.category as CategoryKey] || CATEGORY_CONFIG.Personal;
    const CatIcon = catConfig.icon;

    return (
        <div 
            onClick={onClick}
            className={`group p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col gap-3 mb-3 bg-white dark:bg-slate-900 ${task.completed ? 'opacity-60 bg-slate-50' : getPriorityStyle(task.priority)}`}
        >
            <div className="flex items-center gap-3">
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggle(task.id, e); }}
                    className={`transition-all active:scale-90 flex-shrink-0 ${task.completed ? 'text-slate-400' : getCheckboxColor(task.priority)}`}
                >
                    {task.completed ? <CheckCircle2 size={24} fill="currentColor" className="text-emerald-500" /> : <Circle size={24} className="hover:text-primary transition-colors" />}
                </button>
                
                <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm text-slate-800 dark:text-slate-100 truncate tracking-tight ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                    </h3>
                </div>

                <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={18} />
                </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 px-1">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${catConfig.colors} bg-opacity-15`}>
                    <CatIcon size={12} />
                    {task.category}
                </span>
                
                <span className={`flex items-center gap-1.5 text-[10px] font-bold ${isOverdue ? 'text-red-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    <Calendar size={12} className={isOverdue ? "animate-pulse" : ""} /> 
                    {formatDateForDisplay(task.dueDate)}
                </span>

                {task.durationMinutes > 0 && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        <Clock size={12} /> {task.durationMinutes}m
                    </span>
                )}

                {totalSub > 0 && (
                    <div className="flex-1 min-w-[80px] flex items-center gap-2 ml-auto">
                        <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                style={{ width: `${subtaskProgress}%` }}
                            />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 tabular-nums">
                            {completedSub}/{totalSub}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
