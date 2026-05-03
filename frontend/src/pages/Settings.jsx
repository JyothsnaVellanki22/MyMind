import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlUser, SlLock, SlCloudDownload, SlTrash, SlActionUndo } from 'react-icons/sl';
import { authService, journalService } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Settings = ({ theme, toggleTheme }) => {
  const [user, setUser] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

  useEffect(() => {
    authService.getCurrentUser().then(res => setUser(res)).catch(console.error);
  }, []);

  const handleExport = async () => {
    try {
      const res = await journalService.getAll();
      const data = JSON.stringify(res.data, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `my-mind-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Data exported successfully!");
    } catch (err) {
      toast.error("Failed to export data.");
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("In a real app, your password would be changed now!");
    setPasswords({ old: '', new: '', confirm: '' });
  };

  return (
    <motion.main 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto flex justify-center"
    >
      <div className="w-full max-w-4xl">
        <header className="mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tight">Settings & Profile</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">Manage your personal space.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700">
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-3">
              <SlUser className="text-indigo-500" /> Account Details
            </h3>
            <div className="space-y-6">
               <div>
                 <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Full Name</label>
                 <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-bold text-gray-800 dark:text-white border-2 border-transparent">
                   {user.name}
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-black text-gray-400 dark:text-slate-500 mb-2 uppercase tracking-widest">Email Address</label>
                 <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-bold text-gray-800 dark:text-white border-2 border-transparent">
                   {user.email}
                 </div>
               </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700">
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-8 flex items-center gap-3">
              <SlLock className="text-pink-500" /> Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
               <input 
                 type="password" 
                 placeholder="Current Password" 
                 className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-bold text-gray-800 dark:text-white border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all"
                 value={passwords.old}
                 onChange={e => setPasswords({...passwords, old: e.target.value})}
               />
               <input 
                 type="password" 
                 placeholder="New Password" 
                 className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-bold text-gray-800 dark:text-white border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all"
                 value={passwords.new}
                 onChange={e => setPasswords({...passwords, new: e.target.value})}
               />
               <input 
                 type="password" 
                 placeholder="Confirm New Password" 
                 className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 rounded-2xl font-bold text-gray-800 dark:text-white border-2 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 outline-none transition-all"
                 value={passwords.confirm}
                 onChange={e => setPasswords({...passwords, confirm: e.target.value})}
               />
               <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                 Update Password
               </button>
            </form>
          </section>

          {/* Data Management */}
          <section className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-white dark:border-slate-700 md:col-span-2">
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-8">Data & Privacy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <SlCloudDownload size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 dark:text-white mb-1">Export Data</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-4">Download all your journal entries in JSON format.</p>
                  <button 
                    onClick={handleExport}
                    className="bg-white dark:bg-slate-800 px-6 py-2.5 rounded-xl font-bold text-indigo-600 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    Download Export
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-[2rem] bg-pink-50 dark:bg-pink-900/20 border border-pink-100 dark:border-pink-800 flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-pink-600 shadow-sm">
                  <SlTrash size={24} />
                </div>
                <div>
                  <h4 className="font-black text-gray-800 dark:text-white mb-1">Danger Zone</h4>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium mb-4">Permanently delete your account and all reflections.</p>
                  <button 
                    className="bg-white dark:bg-slate-800 px-6 py-2.5 rounded-xl font-bold text-pink-600 border border-pink-200 dark:border-pink-700 hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                    onClick={() => toast.error("Delete account is not implemented for safety.")}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </motion.main>
  );
};

export default Settings;
