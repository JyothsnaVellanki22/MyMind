import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlPencil, SlCheck, SlActionUndo } from 'react-icons/sl';
import { journalService } from '../services/api';
import toast from 'react-hot-toast';

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    journalService.getById(id)
      .then(res => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setMood(res.data.mood || '');
        setTags(res.data.tags || '');
        setLoading(false);
      })
      .catch(err => {
        toast.error("Failed to load your thought.");
        navigate("/journals");
      });
  }, [id, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await journalService.update(id, { title, content, mood, tags });
      toast.success("Thought updated.");
      navigate("/journals");
    } catch (err) {
      toast.error("Failed to update your thought.");
    }
  };

  if (loading) return <div className="flex-1 p-10 text-center text-gray-500 font-bold">Resurfacing thought...</div>;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto flex justify-center"
    >
      <div className="w-full max-w-2xl">
        <div className="mb-8">
            <Link to="/journals" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold shadow-sm hover:shadow-md transition-all border border-indigo-50 dark:border-slate-700">
              <SlActionUndo size={18} /> Back
            </Link>
        </div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white dark:border-slate-700">
          <h2 className="text-3xl font-black text-gray-800 dark:text-white mb-10 flex items-center gap-4">
            <SlPencil className="text-indigo-500" size={32}/> Refine your thought
          </h2>
          
          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Title</label>
              <input className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-xl text-gray-800 dark:text-white shadow-inner" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Mood</label>
                <input className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white shadow-inner" value={mood} onChange={e => setMood(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Tags</label>
                <input className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white shadow-inner" value={tags} onChange={e => setTags(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Your Reflection</label>
              <textarea rows="10" className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-medium text-lg text-gray-800 dark:text-slate-300 shadow-inner resize-none leading-relaxed" value={content} onChange={e => setContent(e.target.value)} required />
            </div>
            
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-3 text-xl hover:scale-105 active:scale-95">
              <SlCheck size={24} /> Update thought
            </button>
          </form>
        </motion.div>
      </div>
    </motion.main>
  );
};

export default EditJournal;
