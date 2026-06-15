import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiZap, FiTarget, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Identity Registered Successfully');
      navigate('/dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      console.error('[REGISTER_UI] Error:', error);
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
                  <FiZap size={24} />
               </div>
               <h2 className="text-2xl font-bold tracking-tight mb-2">New Operator</h2>
               <p className="text-xs text-text-muted font-medium">Join the fleet and scale your infrastructure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Operator Name</label>
                <div className="relative group">
                   <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
                   <input 
                     type="text" 
                     placeholder="John Doe" 
                     value={name} 
                     onChange={(e) => setName(e.target.value)} 
                     required 
                     className="w-full h-10 pl-10 pr-3 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-medium transition-standard" 
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Secure Email</label>
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Access Key</label>
                <div className="relative group">
                   <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
                   <input 
                     type="password" 
                     placeholder="Create secure key..." 
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
                {loading ? 'Processing...' : 'Register Identity'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border-main text-center">
               <p className="text-xs text-text-muted font-medium">Already registered? <Link to="/login" className="text-brand font-bold hover:underline underline-offset-4">Access Terminal</Link></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;

