import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiZap, FiShield, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Access Granted. Welcome back.');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed. Check your credentials.';
      toast.error(msg);
      console.error('[LOGIN_UI] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-6 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="card-premium p-8 lg:p-10 border border-border-main bg-bg-surface relative">
            <div className="mb-10 text-center">
               <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-6 mx-auto">
                  <FiShield size={24} />
               </div>
               <h2 className="text-2xl font-bold tracking-tight mb-2">Member Login</h2>
               <p className="text-xs text-text-muted font-medium">Enter your credentials to manage your fleet.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Email Identity</label>
                <div className="relative group">
                   <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
                   <input 
                     type="email" 
                     placeholder="name@company.com" 
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)} 
                     required 
                     className="w-full h-10 pl-10 pr-3 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-medium transition-standard" 
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-0.5">
                   <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Access Key</label>
                   <Link to="#" className="text-[10px] font-bold text-brand hover:opacity-80 transition-opacity">Forgot?</Link>
                </div>
                <div className="relative group">
                   <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
                   <input 
                     type="password" 
                     placeholder="••••••••••••" 
                     value={password} 
                     onChange={(e) => setPassword(e.target.value)} 
                     required 
                     className="w-full h-10 pl-10 pr-3 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-medium transition-standard" 
                   />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full h-10 text-[11px] font-bold uppercase tracking-widest mt-4"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border-main text-center">
               <p className="text-xs text-text-muted font-medium">
                New operator? <Link to="/register" className="text-brand font-bold hover:underline underline-offset-4">Register Identity</Link>
               </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

