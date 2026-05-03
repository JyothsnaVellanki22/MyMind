import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SlGrid, 
  SlList, 
  SlPlus, 
  SlTarget, 
  SlBubbles, 
  SlLogout,
  SlUser
} from 'react-icons/sl';
import { Sun, Moon } from 'lucide-react';

const MobileNav = ({ onLogout, theme, toggleTheme }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: SlGrid, label: 'Home' },
    { path: '/todos', icon: SlList, label: 'Tasks' },
    { path: '/visions', icon: SlTarget, label: 'Visions' },
    { path: '/chat', icon: SlBubbles, label: 'Coach' },
  ];

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="md:hidden fixed bottom-24 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-indigo-100 dark:border-slate-800 z-50 p-6 space-y-4"
          >
            <Link 
              to="/settings" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 font-bold transition-all"
            >
              <SlUser size={20}/> Profile Settings
            </Link>
            <button 
              onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 font-bold transition-all"
            >
              {theme === 'light' ? <><Moon size={20}/> Dark Mode</> : <><Sun size={20}/> Light Mode</>}
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-900/10 text-pink-600 dark:text-pink-400 font-bold transition-all"
            >
              <SlLogout size={20}/> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-indigo-100 dark:border-slate-800 px-4 py-3 pb-safe z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(79,70,229,0.15)]">
        <div className="flex justify-between items-center max-w-lg mx-auto relative h-16">
          {navItems.slice(0, 2).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center w-14 transition-all ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                <item.icon size={22} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </Link>
            );
          })}

          <Link to="/new" className="absolute left-1/2 -translate-x-1/2 -top-10">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.9 }} 
              className="bg-indigo-600 p-5 rounded-full text-white shadow-xl shadow-indigo-500/40 border-4 border-white dark:border-slate-900 flex items-center justify-center"
            >
              <SlPlus size={28} />
            </motion.div>
          </Link>

          <div className="w-16" /> {/* Spacer for central button */}

          {navItems.slice(2, 4).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center w-14 transition-all ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                <item.icon size={22} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-bold mt-1">{item.label}</span>
              </Link>
            );
          })}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center w-14 transition-all ${isMenuOpen ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <div className="relative w-6 h-6 flex flex-col items-center justify-center gap-1">
              <span className={`block w-5 h-0.5 bg-current rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-current rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
            <span className="text-[10px] font-bold mt-1">More</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
