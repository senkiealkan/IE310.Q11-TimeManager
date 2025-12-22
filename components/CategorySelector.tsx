
import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  BookOpen,
  User,
  Layers,
  Heart,
  Briefcase
} from 'lucide-react';

// Types and Config needed for this component
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

const CategorySelector = ({
    selectedCategory,
    onSelect
}: {
    selectedCategory: string,
    onSelect: (category: string) => void
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentConfig = CATEGORY_CONFIG[selectedCategory] || CATEGORY_CONFIG.Personal;
    const Icon = currentConfig.icon;

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80
                ${currentConfig.colors} ${currentConfig.border} bg-opacity-10 border-opacity-50`}
            >
                <Icon size={12} />
                {currentConfig.label}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 p-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2">Select Category</div>
                    {Object.keys(CATEGORY_CONFIG).map((key) => {
                        const config = CATEGORY_CONFIG[key as CategoryKey];
                        const ItemIcon = config.icon;
                        const isSelected = selectedCategory === key;
                        return (
                            <button
                                key={key}
                                onClick={() => { onSelect(key); setIsOpen(false); }}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${isSelected ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.colors} bg-opacity-20`}>
                                    <ItemIcon size={14} />
                                </div>
                                <span className={`flex-1 text-left ${isSelected ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{config.label}</span>
                                {isSelected && <Check size={14} className="text-primary" />}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default CategorySelector;