import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SlMagnifier, SlPlus, SlEmotsmile, SlCalender, SlGrid } from 'react-icons/sl';
import { journalService } from '../services/api';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';
import CalendarView from '../components/CalendarView';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Journals = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [search, setSearch] = useState('');
  const [filterMood, setFilterMood] = useState('All');
  const [view, setView] = useState('grid'); // 'grid' or 'calendar'
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJournals();
  }, []);

  useEffect(() => {
    const filtered = journals.filter(j => {
      const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                            j.content.toLowerCase().includes(search.toLowerCase()) ||
                            (j.tags && j.tags.toLowerCase().includes(search.toLowerCase()));
      const matchesMood = filterMood === 'All' || j.mood === filterMood;
      return matchesSearch && matchesMood;
    });
    setFilteredJournals(filtered);
  }, [search, filterMood, journals]);

  const fetchJournals = async () => {
    try {
      const res = await journalService.getAll();
      setJournals(res.data);
      setIsLoading(false);
    } catch (err) {
      toast.error("Failed to load journals");
    }
  };

  const handleDelete = async () => {
    try {
      await journalService.delete(deleteId);
      setJournals(journals.filter(j => j.id !== deleteId));
      toast.success("Journal entry deleted");
    } catch (err) {
      toast.error("Failed to delete journal");
    }
  };

  const uniqueMoods = ['All', ...new Set(journals.map(j => j.mood).filter(Boolean))];

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto"
    >
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tight">Your Reflections</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Browse through your mental history.</p>
        </div>
        <button 
          onClick={() => navigate('/new')}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center gap-3"
        >
          <SlPlus size={20}/> New Entry
        </button>
      </header>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700 mb-12 flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 relative w-full">
          <SlMagnifier className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by title, tag, or keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white"
          />
        </div>
        <div className="flex w-full lg:w-auto gap-4">
          <select 
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="flex-1 lg:w-48 px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-gray-800 dark:text-white cursor-pointer"
          >
            {uniqueMoods.map(mood => <option key={mood} value={mood}>{mood}</option>)}
          </select>
          <div className="flex bg-gray-50 dark:bg-slate-900 p-1 rounded-2xl border-2 border-transparent">
            <button 
              onClick={() => setView('grid')}
              className={`p-3 rounded-xl transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-gray-400'}`}
            >
              <SlGrid size={20} />
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`p-3 rounded-xl transition-all ${view === 'calendar' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-gray-400'}`}
            >
              <SlCalender size={20} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1,2,3,4,5,6].map(i => (
             <div key={i} className="bg-gray-100 dark:bg-slate-800 h-64 rounded-[2.5rem] animate-pulse" />
           ))}
        </div>
      ) : filteredJournals.length === 0 ? (
        <EmptyState 
          icon={SlEmotsmile}
          title={search || filterMood !== 'All' ? "No matches found" : "No entries yet"}
          message={search || filterMood !== 'All' ? "Try adjusting your filters or search term." : "Start your journey by writing your first thought."}
          actionLabel={search || filterMood !== 'All' ? null : "Write Entry"}
          actionPath={search || filterMood !== 'All' ? null : "/new"}
        />
      ) : view === 'calendar' ? (
        <CalendarView journals={filteredJournals} onDateClick={(date) => setSearch(format(date, 'yyyy-MM-dd'))} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJournals.map((j, index) => (
              <JournalCard 
                key={j.id} 
                journal={j} 
                index={index} 
                onClick={() => navigate(`/edit/${j.id}`)}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Reflection?"
        message="This action cannot be undone. Your thought will be permanently removed from your mind."
      />
    </motion.main>
  );
};

export default Journals;
