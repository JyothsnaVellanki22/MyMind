import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlPencil, SlMagicWand, SlCheck, SlActionUndo, SlBulb } from 'react-icons/sl';
import { journalService, aiService } from '../services/api';
import toast from 'react-hot-toast';

const PROMPTS = [
  "What made you feel proud today?",
  "What's one thing you could have done differently?",
  "Describe a small win you experienced.",
  "What's currently weighing on your mind?",
  "Write about someone who inspired you recently.",
  "What are three things you're grateful for today?"
];

const NewJournal = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!title || !content) {
      toast.error("Please write a title and your thoughts first!");
      return;
    }
    const loadingToast = toast.loading("AI is analyzing your patterns...");
    setIsAnalyzing(true);
    try {
      const res = await aiService.analyze(title, content);
      setMood(res.data.mood);
      setTags(res.data.tags);
      if (res.data.summary) {
         setContent(prev => prev + "\n\n--- AI Insight ---\n" + res.data.summary);
      }
      toast.success("Analysis complete!", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to analyze. Check your AI service.", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await journalService.create({ title, content, mood, tags });
      toast.success("Your thought has been captured.");
      navigate("/journals");
    } catch (err) {
      toast.error("Failed to save your thought.");
    }
  };

  const usePrompt = (p) => {
    if (content && !window.confirm("Replace current content with this prompt?")) return;
    setContent(p + "\n\n");
    if (!title) setTitle(p.split('?')[0]);
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto flex justify-center"
    >
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-8">
              <Link to="/journals" className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl text-indigo-600 dark:text-indigo-400 font-bold shadow-sm hover:shadow-md transition-all border border-indigo-50 dark:border-slate-700">
                <SlActionUndo size={18} /> Back to Journals
              </Link>
          </div>
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white dark:border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <h2 className="text-3xl font-black text-gray-800 dark:text-white flex items-center gap-4">
                <SlPencil className="text-indigo-500" size={32}/> What's on your mind?
              </h2>
              <button 
                type="button" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-2 border-indigo-100 dark:border-indigo-800 px-6 py-3 rounded-2xl font-black text-sm shadow-sm transition-all disabled:opacity-50 flex items-center gap-3 hover:scale-105 active:scale-95"
              >
                <SlMagicWand /> {isAnalyzing ? "Analyzing..." : "Auto-Analyze"}
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8">
              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Thought Title</label>
                <input className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-xl text-gray-800 dark:text-white shadow-inner" value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your thought a name..." required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Mood</label>
                  <input className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white shadow-inner" value={mood} onChange={e => setMood(e.target.value)} placeholder="How are you feeling?" />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Tags</label>
                  <input className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white shadow-inner" value={tags} onChange={e => setTags(e.target.value)} placeholder="life, work, growth..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-3 uppercase tracking-widest">Your Reflection</label>
                <textarea rows="10" className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-900 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-medium text-lg text-gray-800 dark:text-slate-300 shadow-inner resize-none leading-relaxed" value={content} onChange={e => setContent(e.target.value)} placeholder="Let the words flow..." required />
              </div>
              
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-3 text-xl hover:scale-105 active:scale-95">
                <SlCheck size={24} /> Seal this thought
              </button>
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-1 space-y-8 pt-20">
           <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800">
              <h3 className="text-xl font-black text-indigo-700 dark:text-indigo-400 mb-6 flex items-center gap-3">
                <SlBulb /> Writing Prompts
              </h3>
              <div className="space-y-4">
                {PROMPTS.map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => usePrompt(p)}
                    className="w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition-all font-medium text-gray-600 dark:text-slate-300 shadow-sm border border-transparent hover:border-indigo-500"
                  >
                    {p}
                  </button>
                ))}
              </div>
           </div>
        </div>
      </div>
    </motion.main>
  );
};

export default NewJournal;
