
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Calendar, CheckCircle2, Circle, Tag, 
  Trash2, Flag, X, Save, AlertCircle, ChevronDown, CalendarDays,
  ListTree, FileText, Search, CornerDownRight,
  BookOpen, User, Briefcase, Heart, Layers, Grid
} from 'lucide-react';
import { 
  format, isToday, isTomorrow, isPast, addDays, isValid, compareAsc
} from 'date-fns';
import { Task, TaskWithDetails, Subtask } from '../types';
import CalendarPicker from './CalendarPicker';
import CategorySelector from './CategorySelector';
import TaskCard from './TaskCard';

// --- Extended Types & Config ---

type CategoryKey = 'Study' | 'Personal' | 'Project' | 'Health' | 'Work';

interface CategoryStyle {
  label: string;
  colors: string; // Tailwind classes for bg/text
  border: string;
  icon: React.ElementType;
}

// Updated Config with Dark Mode Support
const CATEGORY_CONFIG: Record<CategoryKey | string, CategoryStyle> = {
  Study: { 
    label: 'Study', 
    colors: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', 
    border: 'border-purple-200 dark:border-purple-700',
    icon: BookOpen 
  },
  Personal: { 
    label: 'Personal', 
    colors: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', 
    border: 'border-blue-200 dark:border-blue-700',
    icon: User 
  },
  Project: { 
    label: 'Project', 
    colors: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', 
    border: 'border-amber-200 dark:border-amber-700',
    icon: Layers 
  },
  Health: { 
    label: 'Health', 
    colors: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', 
    border: 'border-emerald-200 dark:border-emerald-700',
    icon: Heart 
  },
  Work: { 
    label: 'Work', 
    colors: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300', 
    border: 'border-indigo-200 dark:border-indigo-700',
    icon: Briefcase 
  }
};

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface XPAnimation {
  id: number;
  x: number;
  y: number;
  amount: number;
}

// --- Helpers ---

const parseLocalISO = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.split('-');
  if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Date(dateStr);
};

const formatDateForDisplay = (isoString: string) => {
    const date = parseLocalISO(isoString);
    if (!isValid(date)) return isoString;
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date) && !isToday(date)) return format(date, 'MMM d');
    return format(date, 'MMM d');
};

const TaskList: React.FC<TaskListProps> = ({ tasks: rawTasks, setTasks }) => {
  const tasks = rawTasks as TaskWithDetails[];
  
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithDetails | null>(null);

  // Gamification State
  const [xpAnimations, setXpAnimations] = useState<XPAnimation[]>([]);

  // --- Add Task Form State ---
  const [newTaskData, setNewTaskData] = useState<{
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    category: string;
    dueDate: string;
  }>({
    title: '',
    priority: 'Medium',
    category: 'Personal',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [isAddCalendarOpen, setIsAddCalendarOpen] = useState(false);
  const [isAddDetailsOpen, setIsAddDetailsOpen] = useState(false);
  const [addFormSubtasks, setAddFormSubtasks] = useState<Subtask[]>([]);
  const [addFormNote, setAddFormNote] = useState('');
  const [addFormSubtaskInput, setAddFormSubtaskInput] = useState('');

  // --- Edit Modal State ---
  const [isEditCalendarOpen, setIsEditCalendarOpen] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('focusflow-tasks');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setTasks(parsed);
            }
        } catch (e) {
            console.error("Failed to load tasks", e);
        }
    }
  }, [setTasks]);

  useEffect(() => {
    if (tasks.length > 0) {
        localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // --- Logic ---

  const toggleTask = (id: string, event?: React.MouseEvent) => {
    const task = tasks.find(t => t.id === id);
    const isCompleting = !task?.completed;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

    if (isCompleting && event) {
        const animation: XPAnimation = {
            id: Date.now(),
            x: event.clientX,
            y: event.clientY - 20,
            amount: 50
        };
        setXpAnimations(prev => [...prev, animation]);
        setTimeout(() => {
            setXpAnimations(prev => prev.filter(a => a.id !== animation.id));
        }, 1000);
    }
  };

  const deleteTask = (id: string) => {
    const confirm = window.confirm("Delete this task?");
    if (confirm) {
        setTasks(prev => prev.filter(t => t.id !== id));
        if (editingTask?.id === id) setEditingTask(null);
    }
  };

  const handleAddTask = () => {
    if (!newTaskData.title.trim()) return;
    const newTask: TaskWithDetails = {
        id: Date.now().toString(),
        title: newTaskData.title,
        category: newTaskData.category as any,
        priority: newTaskData.priority,
        completed: false,
        dueDate: newTaskData.dueDate,
        durationMinutes: 30,
        subtasks: addFormSubtasks,
        notes: addFormNote
    };
    setTasks(prev => [newTask, ...prev]);
    
    // Reset Form
    setNewTaskData({
        title: '',
        priority: 'Medium',
        category: 'Personal',
        dueDate: format(new Date(), 'yyyy-MM-dd')
    });
    setAddFormSubtasks([]);
    setAddFormNote('');
    setAddFormSubtaskInput('');
    setIsAddCalendarOpen(false);
    setIsAddDetailsOpen(false);
    setIsAdding(false);
  };

  const handleAddSubtaskToForm = () => {
      if (!addFormSubtaskInput.trim()) return;
      setAddFormSubtasks(prev => [...prev, { id: Date.now().toString(), title: addFormSubtaskInput, completed: false }]);
      setAddFormSubtaskInput('');
  };

  const removeSubtaskFromForm = (id: string) => {
      setAddFormSubtasks(prev => prev.filter(s => s.id !== id));
  };

  const handleSaveEdit = () => {
    if (editingTask && editingTask.title.trim()) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
        setEditingTask(null);
        setNewSubtaskTitle('');
        setIsEditCalendarOpen(false);
    }
  };

  // Subtask Handlers (Edit Mode)
  const addSubtaskEdit = () => {
    if (!editingTask || !newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false
    };
    setEditingTask({
        ...editingTask,
        subtasks: [...(editingTask.subtasks || []), newSub]
    });
    setNewSubtaskTitle('');
  };

  const toggleSubtaskEdit = (subId: string) => {
      if (!editingTask) return;
      const updatedSubtasks = editingTask.subtasks?.map(s => 
          s.id === subId ? { ...s, completed: !s.completed } : s
      );
      setEditingTask({ ...editingTask, subtasks: updatedSubtasks });
  };

  const deleteSubtaskEdit = (subId: string) => {
    if (!editingTask) return;
    setEditingTask({
        ...editingTask,
        subtasks: editingTask.subtasks?.filter(s => s.id !== subId)
    });
  };

  // --- Filtering & Grouping ---

  const filteredTasks = useMemo(() => {
      let result = tasks;
      if (filter !== 'All') {
          result = result.filter(t => t.category === filter);
      }
      if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          result = result.filter(t => t.title.toLowerCase().includes(q));
      }
      return result;
  }, [tasks, filter, searchQuery]);

  const groupedTasks = useMemo(() => {
    const groups = {
        Overdue: [] as TaskWithDetails[],
        Today: [] as TaskWithDetails[],
        Upcoming: [] as TaskWithDetails[],
        Completed: [] as TaskWithDetails[]
    };

    filteredTasks.forEach(task => {
        if (task.completed) {
            groups.Completed.push(task);
            return;
        }
        const date = parseLocalISO(task.dueDate);
        if (isPast(date) && !isToday(date)) {
            groups.Overdue.push(task);
        } else if (isToday(date)) {
            groups.Today.push(task);
        } else {
            groups.Upcoming.push(task);
        }
    });

    const sorter = (a: Task, b: Task) => compareAsc(parseLocalISO(a.dueDate), parseLocalISO(b.dueDate));
    groups.Overdue.sort(sorter);
    groups.Today.sort(sorter);
    groups.Upcoming.sort(sorter);
    groups.Completed.sort((a, b) => Number(b.id) - Number(a.id));
    return groups;
  }, [filteredTasks]);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-surface dark:bg-slate-950 transition-colors duration-300">
      <style>{`
         @keyframes floatUp {
           0% { transform: translateY(0) scale(1); opacity: 1; }
           100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
         }
         .animate-float-up {
           animation: floatUp 0.8s ease-out forwards;
         }
      `}</style>

      {/* XP Popups Overlay */}
      {xpAnimations.map(anim => (
          <div 
             key={anim.id} 
             className="fixed pointer-events-none z-[100] font-bold text-amber-500 text-sm animate-float-up flex items-center gap-1"
             style={{ left: anim.x, top: anim.y }}
          >
             <span className="text-lg">+</span>{anim.amount} XP
          </div>
      ))}

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Mission Log</h1>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border dark:border-slate-800">
                {filteredTasks.filter(t => !t.completed).length} Pending
            </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-300 dark:text-slate-600" />
            </div>
            <input 
                type="text"
                placeholder="Search missions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                    <X size={14} />
                </button>
            )}
        </div>

        {/* Category Filter Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 pb-2 items-center">
            <button
                onClick={() => setFilter('All')}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                    filter === 'All'
                    ? 'bg-slate-800 text-white shadow-lg dark:bg-white dark:text-slate-900' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
                Overview
            </button>
            {Object.keys(CATEGORY_CONFIG).map(key => {
                const config = CATEGORY_CONFIG[key as CategoryKey];
                const isActive = filter === key;
                return (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                            isActive 
                            ? `${config.colors} ring-1 ${config.border} shadow-md` 
                            : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                    >
                        {isActive && React.createElement(config.icon, { size: 12 })}
                        {config.label}
                    </button>
                )
            })}
             <button className="w-10 h-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-primary hover:border-primary dark:hover:border-primary transition-colors shrink-0 ml-1">
                <Grid size={16} />
             </button>
        </div>

        {/* Add Task Form (Inline) */}
        <div className="mb-8">
            {!isAdding ? (
                 <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400 dark:text-slate-600 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
                 >
                    <Plus size={20} />
                    <span>New Mission</span>
                 </button>
            ) : (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 border border-primary/20 animate-in fade-in slide-in-from-top-4">
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="Mission title..." 
                        className="w-full text-lg font-bold outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 mb-6 bg-transparent text-slate-800 dark:text-white"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    
                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <button 
                            onClick={() => setNewTaskData(prev => ({ ...prev, priority: prev.priority === 'High' ? 'Low' : prev.priority === 'Medium' ? 'High' : 'Medium' }))}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-colors ${
                                newTaskData.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900' :
                                newTaskData.priority === 'Medium' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border-orange-100 dark:border-orange-900' :
                                'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-900'
                            }`}
                        >
                            <Flag size={12} fill="currentColor" />
                            {newTaskData.priority}
                        </button>

                        <CategorySelector 
                            selectedCategory={newTaskData.category}
                            onSelect={(cat) => setNewTaskData(prev => ({ ...prev, category: cat }))}
                        />

                        <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-100 dark:border-slate-700">
                             <button 
                                onClick={() => { setNewTaskData(prev => ({ ...prev, dueDate: format(new Date(), 'yyyy-MM-dd') })); setIsAddCalendarOpen(false); }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${newTaskData.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
                             >
                                Today
                             </button>
                             <button 
                                onClick={() => { setNewTaskData(prev => ({ ...prev, dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd') })); setIsAddCalendarOpen(false); }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${newTaskData.dueDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
                             >
                                Tmrw
                             </button>
                             <button 
                                onClick={() => setIsAddCalendarOpen(!isAddCalendarOpen)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${!isToday(parseLocalISO(newTaskData.dueDate)) && !isTomorrow(parseLocalISO(newTaskData.dueDate)) ? 'bg-purple-100 dark:bg-purple-900/30 text-primary dark:text-purple-300' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'}`}
                             >
                                <CalendarDays size={12} />
                                {formatDateForDisplay(newTaskData.dueDate)}
                             </button>
                        </div>
                    </div>

                    {/* Inline Calendar */}
                    {isAddCalendarOpen && (
                        <div className="mb-6">
                            <CalendarPicker 
                                selectedDateStr={newTaskData.dueDate}
                                onSelect={(d) => { setNewTaskData(prev => ({ ...prev, dueDate: d })); setIsAddCalendarOpen(false); }}
                            />
                        </div>
                    )}

                    {/* Extended Details Toggle */}
                    <div className="mb-6">
                         {!isAddDetailsOpen ? (
                             <button onClick={() => setIsAddDetailsOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-primary flex items-center gap-2">
                                 <Plus size={12} /> Add Intel & Subtasks
                             </button>
                         ) : (
                             <div className="space-y-4 animate-in fade-in slide-in-from-top-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                                 {/* Add Subtasks */}
                                 <div>
                                     <div className="flex gap-2 mb-3">
                                         <input 
                                            type="text" 
                                            placeholder="Add sub-mission..."
                                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary dark:text-white"
                                            value={addFormSubtaskInput}
                                            onChange={(e) => setAddFormSubtaskInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtaskToForm()}
                                         />
                                         <button onClick={handleAddSubtaskToForm} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary">
                                             <Plus size={16} />
                                         </button>
                                     </div>
                                     {addFormSubtasks.length > 0 && (
                                         <div className="space-y-2">
                                             {addFormSubtasks.map(st => (
                                                 <div key={st.id} className="flex items-center justify-between bg-white dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 text-xs font-medium dark:text-slate-200">
                                                     <span className="truncate">{st.title}</span>
                                                     <button onClick={() => removeSubtaskFromForm(st.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-400"><X size={14} /></button>
                                                 </div>
                                             ))}
                                         </div>
                                     )}
                                 </div>
                                 {/* Add Note */}
                                 <textarea 
                                    placeholder="Add intelligence briefing..."
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-primary resize-none h-20 dark:text-slate-200"
                                    value={addFormNote}
                                    onChange={(e) => setAddFormNote(e.target.value)}
                                 />
                             </div>
                         )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setIsAdding(false)} 
                            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleAddTask} 
                            disabled={!newTaskData.title.trim()}
                            className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Mission
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Task Groups */}
        <div className="space-y-8">
            {(Object.keys(groupedTasks) as Array<keyof typeof groupedTasks>).map((group) => {
                const groupTasks = groupedTasks[group];
                if (groupTasks.length === 0) return null;

                return (
                    <div key={group} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                                {group}
                            </h2>
                            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600">{groupTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                            {groupTasks.map(task => (
                                <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    onClick={() => setEditingTask(task)}
                                    onToggle={toggleTask}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            {filteredTasks.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[30px] flex items-center justify-center mb-6 shadow-inner">
                        <ListTree size={40} className="text-slate-200" />
                    </div>
                    <h4 className="text-slate-400 font-black uppercase tracking-widest text-sm">No Missions Found</h4>
                    <p className="text-slate-300 dark:text-slate-700 text-xs mt-2 max-w-[200px] mx-auto">Try adjusting your search or category filter.</p>
                </div>
            )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full sm:max-w-md rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-8 shrink-0">
                    <h3 className="font-black text-2xl dark:text-white">Edit Mission</h3>
                    <button 
                        onClick={() => setEditingTask(null)} 
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Title</label>
                        <input 
                            type="text" 
                            value={editingTask.title} 
                            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:border-primary transition-all dark:text-white"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                         <button 
                            onClick={() => setEditingTask({...editingTask, priority: editingTask.priority === 'High' ? 'Low' : editingTask.priority === 'Medium' ? 'High' : 'Medium'})}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-colors ${
                                editingTask.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900' :
                                editingTask.priority === 'Medium' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 border-orange-100 dark:border-orange-900' :
                                'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-900'
                            }`}
                        >
                            <Flag size={12} fill="currentColor" />
                            {editingTask.priority}
                        </button>

                        <CategorySelector 
                            selectedCategory={editingTask.category}
                            onSelect={(cat) => setEditingTask({...editingTask, category: cat as any})}
                        />

                        <button 
                            onClick={() => setIsEditCalendarOpen(!isEditCalendarOpen)}
                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-300`}
                        >
                            <Calendar size={12} />
                            {formatDateForDisplay(editingTask.dueDate)}
                        </button>
                    </div>

                    {isEditCalendarOpen && (
                        <CalendarPicker 
                            selectedDateStr={editingTask.dueDate}
                            onSelect={(d) => { setEditingTask({...editingTask, dueDate: d}); setIsEditCalendarOpen(false); }}
                        />
                    )}

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Notes</label>
                        <textarea 
                            value={editingTask.notes || ''} 
                            onChange={(e) => setEditingTask({...editingTask, notes: e.target.value})}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:border-primary transition-all dark:text-white resize-none h-32"
                            placeholder="Add mission intelligence..."
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sub-missions</label>
                        <div className="space-y-2 mb-4">
                            {editingTask.subtasks?.map(st => (
                                <div key={st.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <button onClick={() => toggleSubtaskEdit(st.id)}>
                                        {st.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-slate-300" />}
                                    </button>
                                    <span className={`flex-1 text-xs font-bold ${st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{st.title}</span>
                                    <button onClick={() => deleteSubtaskEdit(st.id)} className="text-slate-300 hover:text-red-400"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="New sub-mission..."
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addSubtaskEdit()}
                                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-medium outline-none focus:border-primary dark:text-white"
                            />
                            <button onClick={addSubtaskEdit} className="bg-primary text-white p-2 rounded-xl"><Plus size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className="pt-6 shrink-0 flex gap-3">
                    <button 
                        onClick={() => deleteTask(editingTask.id)}
                        className="flex-1 py-4 bg-red-50 text-red-500 font-black rounded-3xl text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Terminate
                    </button>
                    <button 
                        onClick={handleSaveEdit}
                        className="flex-1 py-4 bg-slate-900 dark:bg-primary text-white font-black rounded-3xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                        Save Intelligence
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
