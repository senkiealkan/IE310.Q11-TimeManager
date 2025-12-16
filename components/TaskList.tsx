import React, { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle2, Circle, Tag, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState<'All' | 'Study' | 'Personal' | 'Project'>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
  }

  const addTask = () => {
      if (!newTaskTitle.trim()) return;
      const newTask: Task = {
          id: Date.now().toString(),
          title: newTaskTitle,
          category: 'Personal', // Default
          priority: 'Medium',
          completed: false,
          dueDate: 'Today',
          durationMinutes: 30
      };
      setTasks(prev => [newTask, ...prev]);
      setNewTaskTitle('');
      setIsAdding(false);
  }

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.category === filter);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24 px-6 pt-6 bg-surface">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Tasks</h1>
        <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
            <Plus size={24} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {['All', 'Study', 'Personal', 'Project'].map(cat => (
            <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    filter === cat 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* Add Task Input */}
      {isAdding && (
          <div className="mb-4 bg-white p-4 rounded-xl shadow-md animate-in fade-in slide-in-from-top-4">
              <input 
                autoFocus
                type="text" 
                placeholder="What do you need to do?" 
                className="w-full text-lg font-medium outline-none placeholder:text-slate-300 mb-4"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <div className="flex justify-end gap-2">
                  <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-slate-500 font-medium">Cancel</button>
                  <button onClick={addTask} className="px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg">Add Task</button>
              </div>
          </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
            <div 
                key={task.id} 
                className={`group bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all ${task.completed ? 'opacity-60 bg-slate-50' : 'hover:shadow-md'}`}
            >
                <div className="flex items-start gap-3">
                    <button onClick={() => toggleTask(task.id)} className="mt-1 text-slate-300 hover:text-primary transition-colors">
                        {task.completed ? <CheckCircle2 size={22} className="text-green-500" /> : <Circle size={22} />}
                    </button>
                    
                    <div className="flex-1">
                        <h3 className={`font-semibold text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>{task.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                                task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                                task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 
                                'bg-green-100 text-green-600'
                            }`}>
                                {task.priority}
                            </span>
                            
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Tag size={12} />
                                <span>{task.category}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Calendar size={12} />
                                <span>{task.dueDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        ))}

        {filteredTasks.length === 0 && (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <CheckCircle2 size={32} />
                </div>
                <p className="text-slate-400 font-medium">No tasks found</p>
                <p className="text-slate-300 text-sm">You're all caught up!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;