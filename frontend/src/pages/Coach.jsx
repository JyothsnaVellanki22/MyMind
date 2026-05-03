import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlBubbles, SlMagicWand, SlUser, SlActionUndo } from 'react-icons/sl';
import { aiService, journalService } from '../services/api';
import toast from 'react-hot-toast';

const Coach = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hello! I'm your AI journaling coach. Based on your recent thoughts, what would you like to reflect on today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [journalContext, setJournalContext] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    journalService.getAll().then(res => {
      const context = res.data.slice(0, 5).map(j => `Title: ${j.title}\nMood: ${j.mood}\nContent: ${j.content}`).join('\n\n');
      setJournalContext(context);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    
    try {
      const res = await aiService.chat(messages, input, journalContext);
      setMessages([...newHistory, { role: 'model', content: res.data.response }]);
    } catch (err) {
      toast.error("I'm having trouble connecting to my creative center. Retrying...");
      // Simple retry logic
      try {
        const res = await aiService.chat(messages, input, journalContext);
        setMessages([...newHistory, { role: 'model', content: res.data.response }]);
      } catch (retryErr) {
        setMessages([...newHistory, { role: 'model', content: "I'm still having trouble. Please make sure your AI service is running and API keys are set." }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-hidden flex flex-col h-full"
    >
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-4">
            <SlBubbles className="text-indigo-600" /> AI Coach
          </h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium mt-2">Personalized guidance based on your reflections.</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-2xl max-w-sm">
           <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-tight">
             Disclaimer: This AI coach provides reflections based on your journals. It is not a substitute for professional therapy or medical advice.
           </p>
        </div>
      </header>
      
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-white dark:border-slate-700 p-6 md:p-10 flex flex-col overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-8 mb-6 pr-4 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'}`}>
                  {msg.role === 'user' ? <SlUser /> : <SlMagicWand />}
                </div>
                <div className={`p-6 rounded-[2rem] shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 rounded-tl-none'}`}>
                  <p className="whitespace-pre-wrap font-medium leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="flex gap-4 max-w-[70%] items-center">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center animate-pulse">
                    <SlMagicWand />
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-[2rem] rounded-tl-none font-bold text-indigo-500 animate-pulse">
                    Thinking of a reflection...
                  </div>
               </div>
            </motion.div>
          )}
        </div>
        
        <form onSubmit={handleSend} className="relative flex gap-3 pt-6 border-t border-gray-100 dark:border-slate-700">
          <input 
            value={input} 
            onChange={e=>setInput(e.target.value)} 
            className="flex-1 bg-gray-50 dark:bg-slate-900 px-8 py-5 rounded-2xl border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white shadow-inner text-lg" 
            placeholder="Share your thoughts or ask for advice..." 
            disabled={isLoading}
          />
          <button 
            disabled={isLoading || !input.trim()} 
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:grayscale hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 dark:shadow-none"
          >
            Send
          </button>
        </form>
      </div>
    </motion.main>
  );
};

export default Coach;
