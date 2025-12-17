
import React, { useState, useMemo } from 'react';
import { 
  Plus, Calendar, Clock, CheckCircle2, Circle, Tag, 
  Trash2, Flag, MoreHorizontal, X, Save, AlertCircle, ChevronDown 
} from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

// Helper for Priority Colors
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

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState<'All' | 'Study' | 'Personal' | 'Project' | 'Health'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // New Task Form State
  const [newTaskData, setNewTaskData] = useState<{
    title: string;
    priority: 'High' | 'Medium' | 'Low';
    category: 'Study' | 'Personal' | 'Project' | 'Health';
    dueDate: string;
  }>({
    title: '',
    priority: 'Medium',
    category: 'Personal',
    dueDate: 'Today'
  });

  // --- Actions ---

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (editingTask?.id === id) setEditingTask(null);
  };

  const handleAddTask = () => {
    if (!newTaskData.title.trim()) return;
    const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskData.title,
        category: newTaskData.category,
        priority: newTaskData.priority,
        completed: false,
        dueDate: newTaskData.dueDate,
        durationMinutes: 30 // Default
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskData({ ...newTaskData, title: '' }); // Reset title only
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (editingTask && editingTask.title.trim()) {
        setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
        setEditingTask(null);
    }
  };

  // --- Grouping Logic ---

  const filteredTasks = useMemo(() => {
      return filter === 'All' ? tasks : tasks.filter(t => t.category === filter);
  }, [tasks, filter]);

  const groupedTasks = useMemo(() => {
    const groups = {
        Overdue: [] as Task[],
        Today: [] as Task[],
        Upcoming: [] as Task[],
        Completed: [] as Task[]
    };

    filteredTasks.forEach(task => {
        if (task.completed) {
            groups.Completed.push(task);
            return;
        }

        // Mock Logic for "Overdue" - checking for "Yesterday" string or specific flag
        // In a real app, compare Date objects.
        if (task.dueDate.toLowerCase().includes('yesterday') || task.dueDate.toLowerCase().includes('overdue')) {
            groups.Overdue.push(task);
        } else if (task.dueDate.toLowerCase() === 'today') {
            groups.Today.push(task);
        } else {
            groups.Upcoming.push(task);
        }
    });

    return groups;
  }, [filteredTasks]);

  const hasTasks = filteredTasks.length > 0;

  // --- Render Components ---

  const RenderTaskCard = ({ task, onClick }: { task: Task, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="group bg-white p-3 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex items-center gap-3 mb-2"
    >
        <button 
            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
            className={`transition-colors active:scale-90 ${getCheckboxColor(task.priority)}`}
        >
            {task.completed ? <CheckCircle2 size={22} className="text-slate-400" /> : <Circle size={22} />}
        </button>
        
        <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-sm text-slate-800 truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                {task.title}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                <span className={`px-1.5 py-0.5 rounded ${getPriorityColor(task.priority)} bg-opacity-20 border-0`}>
                    {task.priority}
                </span>
                <span className="flex items-center gap-1">
                   <Tag size={10} /> {task.category}
                </span>
                {task.dueDate !== 'Today' && (
                    <span className="flex items-center gap-1 text-slate-400">
                        <Calendar size={10} /> {task.dueDate}
                    </span>
                )}
            </div>
        </div>

        <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={16} />
        </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full relative">
      
      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-6 pt-6 bg-surface">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
            <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                {filteredTasks.filter(t => !t.completed).length} Pending
            </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
            {['All', 'Study', 'Personal', 'Project', 'Health'].map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat as any)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        filter === cat 
                        ? 'bg-slate-800 text-white shadow-lg shadow-slate-200' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Add Task Area (Inline) */}
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
                        placeholder="What do you need to do?" 
                        className="w-full text-base font-medium outline-none placeholder:text-slate-300 mb-4 bg-transparent"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    />
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {/* Priority Chip */}
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

                        {/* Date Chip */}
                        <button 
                            onClick={() => setNewTaskData(prev => ({ ...prev, dueDate: prev.dueDate === 'Today' ? 'Tomorrow' : prev.dueDate === 'Tomorrow' ? 'Next Week' : 'Today' }))}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <Calendar size={12} />
                            {newTaskData.dueDate}
                        </button>

                        {/* Category Chip */}
                        <button 
                             onClick={() => setNewTaskData(prev => ({ 
                                 ...prev, 
                                 category: prev.category === 'Personal' ? 'Study' : prev.category === 'Study' ? 'Project' : prev.category === 'Project' ? 'Health' : 'Personal' 
                             }))}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                            <Tag size={12} />
                            {newTaskData.category}
                        </button>
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

        {/* Empty State */}
        {!hasTasks && (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={40} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">All Clear!</h3>
                <p className="text-sm text-slate-400">You have no tasks for {filter === 'All' ? 'today' : 'this category'}.</p>
            </div>
        )}

        {/* Task Lists Grouped */}
        <div className="space-y-6">
            {groupedTasks.Overdue.length > 0 && (
                <div className="animate-in slide-in-from-bottom-2">
                    <h2 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <AlertCircle size={12} /> Overdue
                    </h2>
                    {groupedTasks.Overdue.map(task => <RenderTaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} />)}
                </div>
            )}

            {groupedTasks.Today.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-300">
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Calendar size={12} /> Today
                    </h2>
                    {groupedTasks.Today.map(task => <RenderTaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} />)}
                </div>
            )}

            {groupedTasks.Upcoming.length > 0 && (
                <div className="animate-in slide-in-from-bottom-6 duration-500">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming</h2>
                    {groupedTasks.Upcoming.map(task => <RenderTaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} />)}
                </div>
            )}

            {groupedTasks.Completed.length > 0 && (
                <div className="pt-4 border-t border-slate-100 mt-4 opacity-60">
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 hover:text-slate-600">
                        Completed <ChevronDown size={12} />
                    </button>
                    {groupedTasks.Completed.map(task => <RenderTaskCard key={task.id} task={task} onClick={() => setEditingTask(task)} />)}
                </div>
            )}
        </div>
      </div>

      {/* Edit Modal (Overlay) */}
      {editingTask && (
        <div className="absolute inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800">Edit Task</h3>
                    <button onClick={() => setEditingTask(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                        <X size={18} className="text-slate-600" />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Title</label>
                        <input 
                            type="text" 
                            className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-primary transition-colors"
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        />
                    </div>

                    {/* Chips Row */}
                    <div className="flex gap-2">
                         {/* Priority */}
                         <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Priority</label>
                            <button 
                                onClick={() => setEditingTask(prev => prev ? ({ ...prev, priority: prev.priority === 'High' ? 'Low' : prev.priority === 'Medium' ? 'High' : 'Medium' }) : null)}
                                className={`w-full mt-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                                    editingTask.priority === 'High' ? 'bg-red-50 border-red-200 text-red-600' :
                                    editingTask.priority === 'Medium' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                    'bg-blue-50 border-blue-200 text-blue-600'
                                }`}
                            >
                                <Flag size={14} fill="currentColor" />
                                {editingTask.priority}
                            </button>
                         </div>
                         
                         {/* Due Date */}
                         <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Due</label>
                            <button 
                                onClick={() => setEditingTask(prev => prev ? ({ ...prev, dueDate: prev.dueDate === 'Today' ? 'Tomorrow' : 'Today' }) : null)}
                                className="w-full mt-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700"
                            >
                                <Calendar size={14} />
                                {editingTask.dueDate}
                            </button>
                         </div>
                    </div>

                    <div className="pt-4 flex gap-3">
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
        </div>
      )}
    </div>
  );
};

export default TaskList;
