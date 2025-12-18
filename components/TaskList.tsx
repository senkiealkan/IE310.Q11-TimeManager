
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Plus, Calendar, CheckCircle2, Circle, Tag, 
  Trash2, Flag, MoreHorizontal, X, Save, AlertCircle, ChevronDown, CalendarDays,
  ListTree, FileText, Search, CornerDownRight,
  BookOpen, User, Briefcase, Heart, Layers, Grid
} from 'lucide-react';
import { 
  format, isToday, isTomorrow, isPast, addDays, isValid, compareAsc
} from 'date-fns';
import { Task } from '../types';
import CalendarPicker from './CalendarPicker';
import CategorySelector from './CategorySelector';
import TaskCard, { TaskWithDetails } from './TaskCard';

// --- Extended Types & Config ---

type CategoryKey = 'Study' | 'Personal' | 'Project' | 'Health' | 'Work';

interface CategoryStyle {
  label: string;
  colors: string; // Tailwind classes for bg/text
  border: string;
  icon: React.ElementType;
}

const CATEGORY_CONFIG: Record<CategoryKey | string, CategoryStyle> = {
  Study: { 
    label: 'Study', 
    colors: 'bg-purple-100 text-purple-700', 
    border: 'border-purple-200',
    icon: BookOpen 
  },
  Personal: { 
    label: 'Personal', 
    colors: 'bg-blue-100 text-blue-700', 
    border: 'border-blue-200',
    icon: User 
  },
  Project: { 
    label: 'Project', 
    colors: 'bg-amber-100 text-amber-700', 
    border: 'border-amber-200',
    icon: Layers 
  },
  Health: { 
    label: 'Health', 
    colors: 'bg-emerald-100 text-emerald-700', 
    border: 'border-emerald-200',
    icon: Heart 
  },
  Work: { 
    label: 'Work', 
    colors: 'bg-indigo-100 text-indigo-700', 
    border: 'border-indigo-200',
    icon: Briefcase 
  }
};

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

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
        const rect = (event.target as HTMLElement).getBoundingClientRect();
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
    <div className="flex-1 flex flex-col h-full relative">
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

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6 bg-surface">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
            <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                {filteredTasks.filter(t => !t.completed).length} Pending
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
            </div>
            <input 
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                    <X size={14} />
                </button>
            )}
        </div>

        {/* Category Filter Bar (Refined) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2 items-center">
            <button
                onClick={() => setFilter('All')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === 'All'
                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'
                }`}
            >
                All
            </button>
            {Object.keys(CATEGORY_CONFIG).map(key => {
                const config = CATEGORY_CONFIG[key as CategoryKey];
                const isActive = filter === key;
                return (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                            isActive 
                            ? `${config.colors} ring-1 ${config.border} shadow-sm` 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'
                        }`}
                    >
                        {isActive && React.createElement(config.icon, { size: 12 })}
                        {config.label}
                    </button>
                )
            })}
             <button className="w-8 h-8 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors shrink-0 ml-1">
                <Grid size={14} />
             </button>
        </div>

        {/* Add Task Form */}
        <div className="mb-8">
            {!isAdding ? (
                 <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-3 text-slate-500 hover:text-primary transition-colors group w-full"
                 >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Plus size={18} />
                    </div>
                    <span className="font-medium text-sm">Add New Task</span>
                 </button>
            ) : (
                <div className="bg-white p-4 rounded-2xl shadow-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
                    <input 
                        autoFocus
                        type="text" 
                        placeholder="What needs to be done?" 
                        className="w-full text-base font-medium outline-none placeholder:text-slate-300 mb-4 bg-transparent"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    
                    {/* Controls Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <button 
                            onClick={() => setNewTaskData(prev => ({ ...prev, priority: prev.priority === 'High' ? 'Low' : prev.priority === 'Medium' ? 'High' : 'Medium' }))}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                newTaskData.priority === 'High' ? 'bg-red-50 text-red-600 border-red-200' :
                                newTaskData.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                'bg-blue-50 text-blue-600 border-blue-200'
                            }`}
                        >
                            <Flag size={12} fill="currentColor" />
                            {newTaskData.priority}
                        </button>

                        <CategorySelector 
                            selectedCategory={newTaskData.category}
                            onSelect={(cat) => setNewTaskData(prev => ({ ...prev, category: cat }))}
                        />

                        <div className="flex gap-1 bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                             <button 
                                onClick={() => { setNewTaskData(prev => ({ ...prev, dueDate: format(new Date(), 'yyyy-MM-dd') })); setIsAddCalendarOpen(false); }}
                                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${newTaskData.dueDate === format(new Date(), 'yyyy-MM-dd') ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                Today
                             </button>
                             <button 
                                onClick={() => { setNewTaskData(prev => ({ ...prev, dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd') })); setIsAddCalendarOpen(false); }}
                                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${newTaskData.dueDate === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                Tmrw
                             </button>
                             <button 
                                onClick={() => setIsAddCalendarOpen(!isAddCalendarOpen)}
                                className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${!isToday(parseLocalISO(newTaskData.dueDate)) && !isTomorrow(parseLocalISO(newTaskData.dueDate)) ? 'bg-purple-100 text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                             >
                                <CalendarDays size={12} />
                                {formatDateForDisplay(newTaskData.dueDate)}
                             </button>
                        </div>
                    </div>

                    {/* Inline Calendar */}
                    {isAddCalendarOpen && (
                        <div className="mb-4">
                            <CalendarPicker 
                                selectedDateStr={newTaskData.dueDate}
                                onSelect={(d) => { setNewTaskData(prev => ({ ...prev, dueDate: d })); setIsAddCalendarOpen(false); }}
                            />
                        </div>
                    )}

                    {/* Extended Details Toggle */}
                    <div className="mb-4">
                         {!isAddDetailsOpen ? (
                             <button onClick={() => setIsAddDetailsOpen(true)} className="text-xs font-medium text-slate-400 hover:text-primary flex items-center gap-1">
                                 <Plus size={12} /> Add Subtasks & Notes
                             </button>
                         ) : (
                             <div className="space-y-3 animate-in fade-in slide-in-from-top-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                 {/* Add Subtasks */}
                                 <div>
                                     <div className="flex gap-2 mb-2">
                                         <input 
                                            type="text" 
                                            placeholder="Add subtask..."
                                            className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary"
                                            value={addFormSubtaskInput}
                                            onChange={(e) => setAddFormSubtaskInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtaskToForm()}
                                         />
                                         <button onClick={handleAddSubtaskToForm} className="bg-white border border-slate-200 p-1 rounded-lg text-slate-500 hover:text-primary">
                                             <Plus size={14} />
                                         </button>
                                     </div>
                                     {addFormSubtasks.length > 0 && (
                                         <div className="space-y-1">
                                             {addFormSubtasks.map(st => (
                                                 <div key={st.id} className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-100 text-xs">
                                                     <span className="truncate">{st.title}</span>
                                                     <button onClick={() => removeSubtaskFromForm(st.id)} className="text-slate-300 hover:text-red-400"><X size={12} /></button>
                                                 </div>
                                             ))}
                                         </div>
                                     )}
                                 </div>
                                 {/* Add Note */}
                                 <textarea 
                                    placeholder="Add notes..."
                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary resize-none h-16"
                                    value={addFormNote}
                                    onChange={(e) => setAddFormNote(e.target.value)}
                                 />
                             </div>
                         )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setIsAdding(false)} 
                            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleAddTask} 
                            disabled={!newTaskData.title.trim()}
                            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Task
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Task Lists */}
        <div className="space-y-6">
            {Object.entries(groupedTasks).map(([groupName, groupTasks]) => groupTasks.length > 0 && (
                <div key={groupName} className="animate-in slide-in-from-bottom-2">
                     <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
                         groupName === 'Overdue' ? 'text-red-500' :
                         groupName === 'Today' ? 'text-slate-800' :
                         'text-slate-400'
                     }`}>
                        {groupName === 'Overdue' && <AlertCircle size={12} />}
                        {groupName === 'Today' && <Calendar size={12} />}
                        {groupName === 'Completed' ? <><CheckCircle2 size={12} /><button className="flex items-center gap-2">Completed <ChevronDown size={12} /></button></> : groupName}
                    </h2>
                    {groupTasks.map(task => <TaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} onToggle={toggleTask} />)}
                </div>
            ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingTask && (
        <div className="absolute inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h3 className="font-bold text-lg text-slate-800">Edit Task</h3>
                    <button onClick={() => setEditingTask(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                        <X size={18} className="text-slate-600" />
                    </button>
                </div>

                <div className="space-y-6 flex-1">
                    {/* Title Input */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Title</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-primary transition-colors text-slate-800"
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        />
                    </div>

                    {/* Meta Controls (Priority, Category, Due Date) */}
                    <div className="flex gap-2 items-center">
                         <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Priority</label>
                            <button 
                                onClick={() => setEditingTask(prev => prev ? ({ ...prev, priority: prev.priority === 'High' ? 'Low' : prev.priority === 'Medium' ? 'High' : 'Medium' }) : null)}
                                className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                                    editingTask.priority === 'High' ? 'bg-red-50 border-red-200 text-red-600' :
                                    editingTask.priority === 'Medium' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                    'bg-blue-50 border-blue-200 text-blue-600'
                                }`}
                            >
                                <Flag size={14} fill="currentColor" />
                                {editingTask.priority}
                            </button>
                         </div>

                         {/* Integrated Category Selector */}
                         <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                            <div className="w-full">
                                <CategorySelector 
                                    selectedCategory={editingTask.category}
                                    onSelect={(cat) => setEditingTask({ ...editingTask, category: cat as any })}
                                />
                                {/* Overlay styles adjustment for CategorySelector in modal */}
                                <style>{`.w-48 { width: 100% !important; min-width: 140px; }`}</style>
                            </div>
                         </div>
                         
                         <div className="flex-1 relative">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Due Date</label>
                            <button 
                                onClick={() => setIsEditCalendarOpen(!isEditCalendarOpen)}
                                className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors truncate ${isEditCalendarOpen ? 'border-primary bg-purple-50 text-primary' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'}`}
                            >
                                {formatDateForDisplay(editingTask.dueDate)}
                            </button>
                         </div>
                    </div>

                    {/* Calendar Dropdown */}
                    {isEditCalendarOpen && (
                        <CalendarPicker 
                            selectedDateStr={editingTask.dueDate}
                            onSelect={(d) => { setEditingTask({ ...editingTask, dueDate: d }); setIsEditCalendarOpen(false); }}
                        />
                    )}

                    {/* Subtasks Section */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                <ListTree size={12} /> Subtasks
                            </label>
                            <span className="text-xs text-slate-400">
                                {editingTask.subtasks?.filter(s => s.completed).length || 0} / {editingTask.subtasks?.length || 0}
                            </span>
                        </div>
                        
                        {(editingTask.subtasks?.length || 0) > 0 && (
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                                <div 
                                    className="h-full bg-secondary transition-all duration-300"
                                    style={{ width: `${((editingTask.subtasks?.filter(s => s.completed).length || 0) / (editingTask.subtasks?.length || 1)) * 100}%` }}
                                />
                            </div>
                        )}

                        <div className="space-y-2 mb-3">
                            {editingTask.subtasks?.map(sub => (
                                <div key={sub.id} className="flex items-center gap-2 group">
                                    <button 
                                        onClick={() => toggleSubtaskEdit(sub.id)}
                                        className={`transition-colors ${sub.completed ? 'text-green-500' : 'text-slate-300 hover:text-green-400'}`}
                                    >
                                        {sub.completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                                    </button>
                                    <span className={`text-sm flex-1 ${sub.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {sub.title}
                                    </span>
                                    <button onClick={() => deleteSubtaskEdit(sub.id)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <CornerDownRight size={16} className="text-slate-300 mt-3" />
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    placeholder="Add step..." 
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-primary"
                                    value={newSubtaskTitle}
                                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSubtaskEdit()}
                                />
                                <button 
                                    onClick={addSubtaskEdit}
                                    disabled={!newSubtaskTitle.trim()}
                                    className="absolute right-2 top-2 p-0.5 bg-slate-200 rounded hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <FileText size={12} /> Notes
                        </label>
                        <textarea 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary resize-none h-24 text-slate-700 leading-relaxed"
                            placeholder="Add details, links, or thoughts here..."
                            value={editingTask.notes || ''}
                            onChange={(e) => setEditingTask({ ...editingTask, notes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 flex gap-3 shrink-0 border-t border-slate-50 mt-4">
                        <button 
                        onClick={() => deleteTask(editingTask.id)}
                        className="p-4 rounded-xl border border-red-100 text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button 
                        onClick={handleSaveEdit}
                        className="flex-1 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;