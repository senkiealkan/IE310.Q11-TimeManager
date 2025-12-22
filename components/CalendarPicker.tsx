
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  isValid,
  addMonths,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';

// Helper function needed by this component
const parseLocalISO = (dateStr: string) => {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.split('-');
  if (parts.length === 3) return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return new Date(dateStr);
};

const CalendarPicker = ({ 
    selectedDateStr, 
    onSelect 
}: { 
    selectedDateStr: string, 
    onSelect: (dateStr: string) => void 
}) => {
    const selectedDate = parseLocalISO(selectedDateStr);
    const [viewDate, setViewDate] = useState(isValid(selectedDate) ? selectedDate : new Date());

    const days = useMemo(() => {
        const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const startWeek = new Date(start);
        startWeek.setDate(start.getDate() - start.getDay());
        const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
        const endWeek = new Date(end);
        endWeek.setDate(end.getDate() + (6 - end.getDay()));
        return eachDayOfInterval({ start: startWeek, end: endWeek });
    }, [viewDate]);

    return (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 mt-2 relative z-50">
            <div className="flex justify-between items-center mb-4 px-1">
                <button onClick={() => setViewDate(addMonths(viewDate, -1))} className="p-1 hover:bg-slate-200 rounded-full"><ChevronLeft size={18} className="text-slate-500" /></button>
                <span className="text-sm font-bold text-slate-800">{format(viewDate, 'MMMM yyyy')}</span>
                <button onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-slate-200 rounded-full"><ChevronRight size={18} className="text-slate-500" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-bold text-slate-400 mb-1">{d}</div>)}
                {days.map((date, idx) => {
                    const isSelected = isSameDay(parseLocalISO(selectedDateStr), date);
                    const isTodayDate = isToday(date);
                    const isCurrentMonth = isSameMonth(date, viewDate);
                    return (
                        <button
                            key={idx}
                            onClick={() => onSelect(format(date, 'yyyy-MM-dd'))}
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all 
                                ${isSelected ? 'bg-primary text-white shadow-md' : isTodayDate ? 'bg-white border border-primary text-primary font-bold' : 'hover:bg-slate-200 text-slate-700'} 
                                ${!isCurrentMonth ? 'text-slate-300 opacity-50' : ''}`}
                        >
                            {format(date, 'd')}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarPicker;