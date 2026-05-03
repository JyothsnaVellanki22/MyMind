import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, colorClass = "indigo", delay = 0 }) => {
  // Refined "Light & Premium" Color Palette
  const colorMap = {
    pink: {
      bg: 'bg-rose-50 dark:bg-rose-900/10',
      iconBg: 'bg-rose-500',
      text: 'text-rose-600 dark:text-rose-400',
      shadow: 'shadow-rose-200/50'
    },
    orange: {
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      iconBg: 'bg-amber-500',
      text: 'text-amber-600 dark:text-amber-400',
      shadow: 'shadow-amber-200/50'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/10',
      iconBg: 'bg-indigo-500',
      text: 'text-indigo-600 dark:text-indigo-400',
      shadow: 'shadow-indigo-200/50'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/10',
      iconBg: 'bg-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-emerald-200/50'
    }
  };

  const colors = colorMap[colorClass] || colorMap.indigo;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }} 
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-700 flex items-center gap-6 relative overflow-hidden group"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 ${colors.bg} rounded-full group-hover:scale-[3] transition-transform duration-700 z-0 ease-in-out`} />
      
      {/* Icon Container */}
      <div className={`${colors.iconBg} p-4 rounded-2xl text-white shadow-lg ${colors.shadow} dark:shadow-none z-10 transform group-hover:rotate-6 transition-transform`}>
        {Icon && <Icon size={24}/>}
      </div>
      
      {/* Content */}
      <div className="z-10">
        <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${colors.text} opacity-80`}>{label}</p>
        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
