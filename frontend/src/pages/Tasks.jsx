import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlList, SlPlus, SlCheck, SlTrash, SlMagicWand } from 'react-icons/sl';
import { todoService } from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Tasks = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  
  useEffect(() => {
    todoService.getAll().then(res => setTodos(res.data)).catch(console.error);
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await todoService.create(newTodo);
      setTodos([res.data, ...todos]);
      setNewTodo('');
      toast.success("Task added!");
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const res = await todoService.toggle(todo.id, !todo.completed);
      setTodos(todos.map(t => t.id === todo.id ? res.data : t));
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await todoService.delete(deleteId);
      setTodos(todos.filter(t => t.id !== deleteId));
      toast.success("Task removed");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto flex flex-col items-center"
    >
      <div className="w-full max-w-3xl">
        <header className="mb-12 text-center">
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
            className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <SlList size={40} className="text-indigo-600 dark:text-indigo-400"/>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-800 dark:text-white tracking-tight">Daily Intentions</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-4 font-medium text-xl">What will you conquer today?</p>
        </header>

        <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white dark:border-slate-700 flex flex-col min-h-[600px]">
          <form onSubmit={handleAddTodo} className="mb-10 flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1 px-8 py-5 bg-gray-50 dark:bg-slate-900 rounded-[1.5rem] border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800 dark:text-white shadow-inner text-lg"
            />
            <button type="submit" className="bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none font-black flex items-center justify-center gap-3 text-lg hover:scale-105 active:scale-95">
              <SlPlus size={24}/> Add Task
            </button>
          </form>
          
          <div className="space-y-4 flex-1">
            <AnimatePresence mode="popLayout">
              {todos.length === 0 ? (
                <div className="text-center py-24 text-gray-400 font-bold flex flex-col items-center justify-center h-full">
                  <SlCheck size={80} className="text-indigo-100 dark:text-slate-700 mb-8" />
                  <p className="text-3xl text-gray-600 dark:text-slate-400 mb-2">You're all caught up!</p>
                  <p>Peace of mind is yours today.</p>
                </div>
              ) : (
                todos.map(todo => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={todo.id} 
                    className="flex items-center gap-6 p-6 rounded-[1.5rem] border-2 border-transparent hover:border-indigo-50 dark:hover:border-indigo-900/20 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group shadow-sm bg-white dark:bg-slate-800"
                  >
                    <button 
                      onClick={() => handleToggleTodo(todo)}
                      className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 shadow-sm ${todo.completed ? 'bg-indigo-500 border-indigo-500 text-white scale-110 shadow-indigo-200' : 'border-gray-300 dark:border-slate-600 text-transparent hover:border-indigo-400'}`}
                    >
                      <SlCheck size={20} className={todo.completed ? 'opacity-100' : 'opacity-0'} />
                    </button>
                    <span className={`flex-1 font-bold text-xl transition-colors ${todo.completed ? 'text-gray-400 dark:text-slate-600 line-through' : 'text-gray-700 dark:text-slate-300'}`}>
                      {todo.content}
                    </span>
                    <button 
                      onClick={() => setDeleteId(todo.id)}
                      className="w-12 h-12 flex items-center justify-center rounded-2xl text-gray-400 hover:bg-pink-100 dark:hover:bg-pink-900/20 hover:text-pink-600 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <SlTrash size={24} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Task?"
        message="This task will be removed from your intentions list permanently."
      />
    </motion.main>
  );
};

export default Tasks;
