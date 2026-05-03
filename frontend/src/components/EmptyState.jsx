import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SlPlus } from 'react-icons/sl';

const EmptyState = ({ icon: Icon, title, message, actionLabel, actionPath }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border-2 border-dashed border-indigo-200 dark:border-slate-700 rounded-[2.5rem] p-12 text-center shadow-sm"
    >
      <div className="mx-auto w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Icon size={40} className="text-indigo-500"/>
      </div>
      <h4 className="text-2xl font-bold text-gray-700 dark:text-slate-200 mb-3">{title}</h4>
      <p className="text-gray-500 dark:text-slate-400 mb-8 font-medium text-lg max-w-md mx-auto">{message}</p>
      {actionPath && (
        <Link to={actionPath} className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95">
          <SlPlus size={20}/> {actionLabel}
        </Link>
      )}
    </motion.div>
  );
};

export default EmptyState;
