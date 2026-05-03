import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlTarget, SlPlus, SlCheck, SlTrash } from 'react-icons/sl';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { visionService, journalService, todoService } from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Visions = ({ theme }) => {
  const [visions, setVisions] = useState([]);
  const [journals, setJournals] = useState([]);
  const [todos, setTodos] = useState([]);
  const [newVision, setNewVision] = useState({ title: '', description: '', category: '' });
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vRes, jRes, tRes] = await Promise.all([
          visionService.getAll(),
          journalService.getAll(),
          todoService.getAll()
        ]);
        setVisions(vRes.data);
        setJournals(jRes.data);
        setTodos(tRes.data);
      } catch (error) {
        toast.error("Failed to fetch analytics data");
      }
    };
    fetchData();
  }, []);

  const handleAddVision = async (e) => {
    e.preventDefault();
    if (!newVision.title || !newVision.description || !newVision.category) return;
    try {
      const res = await visionService.create(newVision);
      setVisions([res.data, ...visions]);
      setNewVision({ title: '', description: '', category: '' });
      toast.success("New vision added!");
    } catch (err) {
      toast.error("Failed to add vision");
    }
  };

  const handleDelete = async () => {
    try {
      await visionService.delete(deleteId);
      setVisions(visions.filter(v => v.id !== deleteId));
      toast.success("Vision removed");
    } catch (err) {
      toast.error("Failed to delete vision");
    }
  };

  const handleToggleVision = async (vision) => {
    try {
      const res = await visionService.toggle(vision.id, !vision.completed);
      setVisions(visions.map(v => v.id === vision.id ? res.data : v));
      toast.success(res.data.completed ? "Goal achieved!" : "Goal resumed");
    } catch (err) {
      toast.error("Failed to update vision");
    }
  };

  // Data processing for charts
  const completedTodos = todos.filter(t => t.completed).length;
  const pendingTodos = todos.length - completedTodos;
  const todoData = [
    { name: 'Completed', value: completedTodos, color: '#4f46e5' },
    { name: 'Pending', value: pendingTodos, color: '#ec4899' }
  ];

  const moodMap = {};
  journals.forEach(j => {
    if (j.mood) moodMap[j.mood] = (moodMap[j.mood] || 0) + 1;
  });
  const moodData = Object.keys(moodMap).map(mood => ({ name: mood, count: moodMap[mood] }));

  const categoryMap = {};
  visions.forEach(v => {
    if (v.category) {
      if (!categoryMap[v.category]) categoryMap[v.category] = { category: v.category, Pending: 0, Completed: 0 };
      if (v.completed) categoryMap[v.category].Completed += 1;
      else categoryMap[v.category].Pending += 1;
    }
  });
  const categoryData = Object.values(categoryMap);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black text-gray-800 dark:text-white tracking-tight leading-tight">
            Vision Board <br/>
            <span className="text-indigo-600">Analytics</span>
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-4 font-medium text-xl">Track your progress and mental patterns.</p>
        </header>

        {/* Analytics Dashboard Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Chart 1: Tasks Completion Pie */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-white dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-6">Task Completion</h4>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={todoData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    {todoData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }} />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Mood Distribution Bar */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-white dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-6">Mood Analysis</h4>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1}/>
                  <XAxis dataKey="name" tick={{fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false}/>
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }} cursor={{fill: 'transparent'}}/>
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Visions by Category */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl border border-white dark:border-slate-800 flex flex-col items-center">
            <h4 className="text-xs font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-6">Vision Progress</h4>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{top:0, right:10, left:-20, bottom:0}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1}/>
                  <XAxis type="number" hide/>
                  <YAxis dataKey="category" type="category" tick={{fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b'}} axisLine={false} tickLine={false} />
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[4, 0, 0, 4]} />
                  <Bar dataKey="Pending" stackId="a" fill={theme === 'dark' ? '#334155' : '#e0e7ff'} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Simple Vision Count */}
          <div className="bg-indigo-600 p-8 rounded-[3rem] shadow-2xl shadow-indigo-200 dark:shadow-none flex flex-col items-center justify-center text-white text-center">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
               <SlTarget size={32} />
             </div>
             <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-1">Total Visions</p>
             <h3 className="text-5xl font-black">{visions.length}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* New Vision Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[3rem] shadow-xl border border-white dark:border-slate-700">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-3">
                <SlPlus className="text-indigo-500"/> New Vision
              </h3>
              <form onSubmit={handleAddVision} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Goal Title</label>
                  <input className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none font-bold text-gray-800 dark:text-white transition-all" value={newVision.title} onChange={e => setNewVision({...newVision, title: e.target.value})} placeholder="e.g., Run a Marathon" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Category</label>
                  <input className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none font-bold text-gray-800 dark:text-white transition-all" value={newVision.category} onChange={e => setNewVision({...newVision, category: e.target.value})} placeholder="Health, Career, Personal..." required />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Description</label>
                  <textarea rows="4" className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none font-medium text-gray-800 dark:text-slate-300 resize-none transition-all" value={newVision.description} onChange={e => setNewVision({...newVision, description: e.target.value})} placeholder="Describe your vision..." required />
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95">
                  Add Vision
                </button>
              </form>
            </div>
          </div>
          
          {/* Visions List */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {visions.map((vision) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={vision.id} 
                    className={`p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700 relative group flex flex-col h-full transition-all ${vision.completed ? 'bg-gray-50 dark:bg-slate-900/50 opacity-70 grayscale-[0.5]' : 'bg-white dark:bg-slate-800 shadow-indigo-100/30'}`}
                  >
                    <div className="flex gap-2 absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleToggleVision(vision)} className={`w-10 h-10 flex items-center justify-center rounded-2xl ${vision.completed ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'} hover:scale-110 transition-transform`}>
                         <SlCheck size={18} />
                      </button>
                      <button onClick={() => setDeleteId(vision.id)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-pink-50 dark:bg-pink-900/30 text-pink-500 hover:scale-110 transition-transform">
                        <SlTrash size={18} />
                      </button>
                    </div>
                    <span className={`inline-block px-4 py-1.5 text-xs font-black rounded-xl mb-4 self-start tracking-widest uppercase ${vision.completed ? 'bg-gray-200 dark:bg-slate-700 text-gray-500' : 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600'}`}>
                      {vision.category}
                    </span>
                    <h4 className={`text-2xl font-black mb-4 leading-tight ${vision.completed ? 'text-gray-400 dark:text-slate-600 line-through' : 'text-gray-800 dark:text-white'}`}>
                      {vision.title}
                    </h4>
                    <p className={`font-medium text-lg flex-1 leading-relaxed ${vision.completed ? 'text-gray-400 dark:text-slate-500' : 'text-gray-600 dark:text-slate-400'}`}>
                      {vision.description}
                    </p>
                    {vision.completed && (
                      <span className="mt-6 text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                        <SlCheck/> Goal Achieved
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Remove Vision?"
        message="Are you sure you want to let go of this dream? You can always set new ones later."
      />
    </motion.main>
  );
};

export default Visions;
