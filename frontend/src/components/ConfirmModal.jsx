import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Delete", cancelLabel = "Cancel" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl w-full max-w-md relative z-10 border border-white/50 dark:border-slate-700"
          >
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4">{title}</h3>
            <p className="text-gray-500 dark:text-slate-400 mb-8 font-medium leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
              >
                {cancelLabel}
              </button>
              <button 
                onClick={() => { onConfirm(); onClose(); }}
                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-200 dark:shadow-none transition-all"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
