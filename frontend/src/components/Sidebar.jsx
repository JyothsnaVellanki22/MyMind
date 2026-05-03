import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  SlGrid, 
  SlList, 
  SlPlus, 
  SlTarget, 
  SlBubbles, 
  SlLogout, 
  SlMagicWand,
  SlUser
} from 'react-icons/sl';
import { Sun, Moon } from 'lucide-react';

const Sidebar = ({ onLogout, theme, toggleTheme }) => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: SlGrid, label: 'Dashboard' },
    { path: '/journals', icon: SlGrid, label: 'All Journals' }, // Added this
    { path: '/todos', icon: SlList, label: 'Tasks' },
    { path: '/new', icon: SlPlus, label: 'New Entry' },
    { path: '/visions', icon: SlTarget, label: 'Visions' },
    { path: '/chat', icon: SlBubbles, label: 'AI Coach' }
  ];

  return (
    <aside className="w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border-r border-indigo-50 dark:border-slate-800 hidden md:flex flex-col shadow-2xl shadow-indigo-100/50 dark:shadow-none relative z-20">
      <div className="p-8 flex justify-between items-center">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 flex items-center gap-3 tracking-tight"
        >
          <SlMagicWand className="text-indigo-500" size={28}/> 
          My Mind
        </motion.h1>
      </div>
      <nav className="flex-1 px-6 space-y-3 mt-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div 
                whileHover={{ x: 5, backgroundColor: isActive ? "" : (theme === 'dark' ? "rgba(30, 41, 59, 0.8)" : "rgba(238, 242, 255, 0.8)") }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-500 shadow-sm shadow-indigo-100 dark:shadow-none' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 border-2 border-transparent'}`}
              >
                <item.icon size={22}/> {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 mt-auto space-y-3">
        <Link to="/settings">
          <motion.div 
            whileHover={{ x: 5 }}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${location.pathname === '/settings' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-500' : 'text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
          >
            <SlUser size={22}/> Profile
          </motion.div>
        </Link>
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-slate-700"
        >
          {theme === 'light' ? <><Moon size={22}/> Dark Mode</> : <><Sun size={22}/> Light Mode</>}
        </button>
        <button onClick={onLogout} className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all border border-transparent hover:border-pink-100 dark:hover:border-pink-900/30">
          <SlLogout size={22}/> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
