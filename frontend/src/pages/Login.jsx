import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlMagicWand, SlLogin, SlUserFollowing, SlTarget, SlBubbles, SlGrid, SlCheck } from 'react-icons/sl';
import { Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

const Login = ({ setToken, theme, toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await authService.register(email, password, name);
        toast.success("Account created! Logging you in...");
      }
      const data = await authService.login(email, password);
      setToken(data.access_token);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error("Authentication failed. Please check your credentials.");
    }
  };

  const handleDemoLogin = async () => {
    toast.loading("Setting up your demo experience...", { duration: 1500 });
    try {
      // Direct login for demo
      const data = await authService.login('demo@example.com', 'password123');
      setToken(data.access_token);
      toast.success("Welcome to the demo!");
    } catch (err) {
      // Fallback if demo user doesn't exist
      setEmail('demo@example.com');
      setPassword('password123');
      setShowAuth(true);
      toast.error("Demo login failed, but I've filled the credentials for you.");
    }
  };

  if (!showAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
        {/* Landing Page Content */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
              <SlMagicWand size={20} />
            </div>
            <span className="text-xl font-black text-gray-800 dark:text-white tracking-tighter">My Mind</span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="p-3 text-gray-500 hover:text-indigo-600 transition-colors">
               {theme === 'light' ? <Moon size={20}/> : <Sun size={20}/>}
             </button>
             <button 
               onClick={() => setShowAuth(true)}
               className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
             >
               Get Started
             </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-28 pb-32 px-6 max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white mb-10 tracking-tighter leading-[1.1]">
              Your thoughts, <br/>
              <span className="text-indigo-600 dark:text-indigo-400">
                beautifully organized.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-slate-400 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
              A private, AI-powered space to reflect, track goals, and grow every single day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <button 
                onClick={() => { setIsRegistering(true); setShowAuth(true); }}
                className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 dark:shadow-none hover:scale-105 active:scale-95"
              >
                Start My Journal
              </button>
              <button 
                onClick={handleDemoLogin}
                className="w-full sm:w-auto bg-white dark:bg-slate-900 text-gray-800 dark:text-white border-2 border-gray-100 dark:border-slate-800 px-12 py-5 rounded-[2.5rem] font-black text-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-xl shadow-gray-100 dark:shadow-none hover:scale-105 active:scale-95"
              >
                Try Demo
              </button>
            </div>
          </motion.div>

          {/* Abstract blobs / Background Depth */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Primary Center Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[160px] animate-pulse" />
            
            {/* Top Right Accent */}
            <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[140px]" />
            
            {/* Bottom Left Accent */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[140px]" style={{ animationDelay: '2s' }} />
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white dark:bg-slate-950 py-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-center mb-20 dark:text-white">Everything you need to reflect.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: SlMagicWand, title: "AI Analysis", desc: "Auto-tags, mood detection, and sentiment analysis for every entry." },
                { icon: SlTarget, title: "Vision Board", desc: "Set long-term goals and track your journey towards them." },
                { icon: SlBubbles, title: "AI Coach", desc: "Chat with an AI trained on your reflections to gain deeper insights." },
                { icon: SlCheck, title: "Task Manager", desc: "Daily todos integrated right into your reflection workflow." },
                { icon: SlGrid, title: "Secure & Private", desc: "Your data is yours alone. Private, encrypted, and safe." },
                { icon: SlUserFollowing, title: "Streak System", desc: "Stay motivated with daily reflection targets and streaks." }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -10 }}
                  className="p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 backdrop-blur-sm"
                >
                  <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                    <f.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 dark:text-white">{f.title}</h3>
                  <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 text-center border-t border-gray-100 dark:border-slate-900 bg-white dark:bg-slate-950 relative z-10">
           <p className="text-gray-400 font-bold">© 2026 My Mind. Designed for clarity.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:bg-slate-950 p-6 overflow-hidden relative">
      <div className="absolute top-6 right-6 z-20 flex gap-4">
        <button 
          onClick={() => setShowAuth(false)}
          className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl text-white font-bold hover:bg-white/30 transition-all border border-white/30 shadow-lg"
        >
          Back
        </button>
        <button 
          onClick={toggleTheme}
          className="p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/30 transition-all border border-white/30 shadow-lg"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-md border border-white/50 dark:border-slate-700/50 z-10 relative"
      >
        <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] mx-auto mb-8 shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white">
          <SlMagicWand size={36} />
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-8 tracking-tight">
          {isRegistering ? 'Join the Magic' : 'Welcome Back!'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence>
            {isRegistering && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <input className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-100 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all font-medium text-gray-800 dark:text-white shadow-sm outline-none" type="text" placeholder="Your beautiful name" value={name} onChange={e => setName(e.target.value)} required />
              </motion.div>
            )}
          </AnimatePresence>
          <input className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-100 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all font-medium text-gray-800 dark:text-white shadow-sm outline-none" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          <div className="relative">
            <input 
              className="w-full px-5 py-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-gray-100 dark:border-slate-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all font-medium text-gray-800 dark:text-white shadow-sm outline-none pr-14" 
              type={showPassword ? "text" : "password"} 
              placeholder="Secret password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors p-2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isRegistering ? <><SlUserFollowing size={22} /> Let's Go!</> : <><SlLogin size={22} /> Login</>}
          </motion.button>
        </form>
        
        <p className="mt-8 text-center text-gray-500 font-medium">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline decoration-2 underline-offset-4">
            {isRegistering ? 'Login here' : 'Sign up!'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
