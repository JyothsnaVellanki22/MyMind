import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SlBookOpen, SlHeart, SlCheck, SlFire, SlPencil, SlPlus, SlEmotsmile } from 'react-icons/sl';
import { journalService, todoService } from '../services/api';
import StatCard from '../components/StatCard';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const [journals, setJournals] = useState([]);
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({
    mood: 'Neutral',
    streak: 0,
    totalEntries: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jRes, tRes] = await Promise.all([
          journalService.getAll(),
          todoService.getAll()
        ]);
        
        const journalData = jRes?.data || [];
        const todoData = tRes?.data || [];
        
        setJournals(journalData);
        setTodos(todoData);
        
        // Calculate stats with null checks
        const pending = todoData.filter(t => !t.completed).length;
        const lastMood = (journalData.length > 0 && journalData[0]?.mood) ? journalData[0].mood : 'Not set';
        
        setStats({
          mood: lastMood,
          streak: Math.min(journalData.length, 5),
          totalEntries: journalData.length,
          pendingTasks: pending
        });
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto relative z-10"
    >
      <header className="mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-gray-800 dark:text-white">
          Hello, <span className="text-indigo-600">Thinker!</span>
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-4 font-medium text-xl">
          Welcome back! Here is a summary of your mental headquarters.
        </p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={SlHeart} label="Today's Mood" value={stats.mood || 'Neutral'} colorClass="pink" delay={0.1} />
        <StatCard icon={SlFire} label="Current Streak" value={`${stats.streak || 0} Days`} colorClass="orange" delay={0.2} />
        <StatCard icon={SlBookOpen} label="Total Entries" value={stats.totalEntries || 0} colorClass="indigo" delay={0.3} />
        <StatCard icon={SlCheck} label="Pending Tasks" value={stats.pendingTasks || 0} colorClass="emerald" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-3">
              <SlPencil size={24} className="text-indigo-500"/> Recent Thoughts
            </h3>
            <button onClick={() => navigate('/journals')} className="text-indigo-600 font-bold hover:underline">
              View All
            </button>
          </div>
          
          {journals.length === 0 ? (
            <EmptyState 
              icon={SlEmotsmile}
              title="It's quiet here..."
              message="Why not write down your first thought?"
              actionLabel="Write Entry"
              actionPath="/new"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {journals.slice(0, 4).map((j, index) => (
                <JournalCard 
                  key={j.id} 
                  journal={j} 
                  index={index} 
                  onClick={() => navigate(`/edit/${j.id}`)}
                  onDelete={() => {/* Modals handled in All Journals */}}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-8 flex items-center gap-3">
              <SlCheck size={24} className="text-emerald-500"/> Tasks
            </h3>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700 space-y-4">
              {todos.filter(t => !t.completed).slice(0, 3).map(todo => (
                <div key={todo.id} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-lg border-2 border-indigo-200 dark:border-slate-700 group-hover:border-indigo-500 transition-all" />
                  <span className="font-bold text-gray-700 dark:text-slate-300 line-clamp-1">{todo.content}</span>
                </div>
              ))}
              {todos.filter(t => !t.completed).length === 0 && (
                <p className="text-gray-400 font-bold text-center py-4">No pending tasks!</p>
              )}
              <button onClick={() => navigate('/todos')} className="w-full mt-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-500 font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                Go to Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

export default Dashboard;
