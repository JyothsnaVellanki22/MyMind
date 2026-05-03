import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';

const CalendarView = ({ journals, onDateClick }) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getJournalsForDate = (date) => {
    return journals.filter(j => isSameDay(new Date(j.date), date));
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-xl border border-white dark:border-slate-700">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-black text-gray-800 dark:text-white">{format(today, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="w-10 text-center text-xs font-black text-gray-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, i) => {
          const dayJournals = getJournalsForDate(day);
          const isCurrentMonth = day.getMonth() === today.getMonth();
          const isToday = isSameDay(day, today);
          
          return (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.1 }}
              onClick={() => dayJournals.length > 0 && onDateClick(day)}
              className={`
                aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer transition-all
                ${!isCurrentMonth ? 'opacity-20' : 'opacity-100'}
                ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-gray-50 dark:bg-slate-900 text-gray-700 dark:text-slate-300'}
                ${dayJournals.length > 0 && !isToday ? 'border-2 border-indigo-500' : 'border-2 border-transparent'}
              `}
            >
              <span className="text-sm font-bold">{format(day, 'd')}</span>
              {dayJournals.length > 0 && (
                <div className={`w-1.5 h-1.5 rounded-full absolute bottom-2 ${isToday ? 'bg-white' : 'bg-indigo-500'}`} />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
