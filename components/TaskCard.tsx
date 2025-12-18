
import React from 'react';
import { 
  CheckCircle2, Circle, Calendar, ListTree, MoreHorizontal,
  BookOpen, User, Briefcase, Heart, Layers
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, isValid } from 'date-fns';
import { Task } from '../types';

// Extended Types and Config needed for this component
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskWithDetails extends Task {
  subtasks?: Subtask[];
  notes?: string;
}

type CategoryKey = 'Study' | 'Personal' | 'Project' | 'Health' | 'Work';

interface CategoryStyle {
  label: string;
  colors: string; // Tailwind classes for bg/text
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

// Helper functions needed for this component
const parseLocalISO = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.split('-');
  if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Date(dateStr);
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-500 border-red-500 bg-red-50';
    case 'Medium': return 'text-orange-500 border-orange-500 bg-orange-50';
    case 'Low': return 'text-blue-500 border-blue-500 bg-blue-50';
    default: return 'text-slate-400 border-slate-300 bg-slate-50';
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
    
    // Get Category Config
    const catConfig = CATEGORY_CONFIG[task.category as CategoryKey] || CATEGORY_CONFIG.Personal;
    const CatIcon = catConfig.icon;

    return (
        <div 
            onClick={onClick}
            className="group bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex items-center gap-3 mb-2"
        >
            <button 
                onClick={(e) => { e.stopPropagation(); onToggle(task.id, e); }}
                className={`transition-colors active:scale-90 ${getCheckboxColor(task.priority)}`}
            >
                {task.completed ? <CheckCircle2 size={22} className="text-slate-400" /> : <Circle size={22} />}
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className={`font-medium text-sm text-slate-800 truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                    </h3>
                </div>
                
                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                    <span className={`px-1.5 py-0.5 rounded border flex items-center gap-1 ${catConfig.colors} bg-opacity-20 border-opacity-50`}>
                        <CatIcon size={10} />
                        {task.category}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)} bg-opacity-20 border-0`}>
                        {task.priority}
                    </span>
                    <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : ''}`}>
                        <Calendar size={10} /> {formatDateForDisplay(task.dueDate)}
                    </span>
                    {totalSub > 0 && (
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <ListTree size={10} /> {completedSub}/{totalSub}
                        </span>
                    )}
                </div>
            </div>
            <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal size={16} />
            </button>
        </div>
    );
};

export default TaskCard;
