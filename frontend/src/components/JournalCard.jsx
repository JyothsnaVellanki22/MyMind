import React from 'react';
import { motion } from 'framer-motion';
import { SlCalender, SlHeart, SlPencil, SlTrash } from 'react-icons/sl';
import { format } from 'date-fns';

const JournalCard = ({ journal, onClick, onDelete, index }) => {
  // Safety check for date
  const journalDate = journal.date ? new Date(journal.date) : new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ y: -5, scale: 1.02 }} 
      className="bg-white dark:bg-slate-800/40 backdrop-blur-md p-7 rounded-[2.5rem] shadow-xl shadow-indigo-100/40 dark:shadow-none border border-white dark:border-slate-700/50 flex flex-col h-full relative group cursor-pointer transition-colors duration-300"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-extrabold text-gray-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{journal.title}</h4>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick(); // Trigger edit
              }}
              className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-all"
              title="Edit Thought"
            >
              <SlPencil size={18} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(journal.id);
              }}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all"
              title="Delete Thought"
            >
              <SlTrash size={18} />
            </button>
          </div>
        </div>
        
        <p className="text-indigo-500 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
          <SlCalender size={12}/> {format(journalDate, 'MMM dd, yyyy')}
        </p>
        
        <p className="text-gray-600 dark:text-slate-400 line-clamp-3 font-medium leading-relaxed">
          {journal.content}
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-700/50 flex flex-wrap gap-2">
        {journal.mood && (
          <span className="px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-xl flex items-center gap-1.5 border border-rose-100 dark:border-rose-900/30">
            <SlHeart size={12}/> {journal.mood}
          </span>
        )}
        {journal.tags && journal.tags.split(',').map((tag, i) => (
          <span key={i} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold rounded-xl border border-indigo-100 dark:border-indigo-900/30">
            #{tag.trim()}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default JournalCard;
