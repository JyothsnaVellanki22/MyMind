import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Journals from './pages/Journals';
import NewJournal from './pages/NewJournal';
import EditJournal from './pages/EditJournal';
import Tasks from './pages/Tasks';
import Visions from './pages/Visions';
import Coach from './pages/Coach';
import Settings from './pages/Settings';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      {!token ? (
        <Login setToken={setToken} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans relative overflow-hidden transition-colors duration-300">
          {/* Light Mode Blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 dark:hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-purple-200/20 rounded-full blur-[120px] mix-blend-multiply" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-indigo-200/20 rounded-full blur-[120px] mix-blend-multiply" />
          </div>

          {/* Dark Mode Blobs (Deeper, more subtle) */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 hidden dark:block">
            <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[140px]" />
            <div className="absolute top-[20%] left-[30%] w-[30rem] h-[30rem] bg-blue-600/5 rounded-full blur-[100px]" />
          </div>

          <Sidebar onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
          
          <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard theme={theme} />} />
              <Route path="/journals" element={<Journals theme={theme} />} />
              <Route path="/todos" element={<Tasks theme={theme} />} />
              <Route path="/new" element={<NewJournal theme={theme} />} />
              <Route path="/edit/:id" element={<EditJournal theme={theme} />} />
              <Route path="/visions" element={<Visions theme={theme} />} />
              <Route path="/chat" element={<Coach theme={theme} />} />
              <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <MobileNav onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
        </div>
      )}
    </>
  );
}
