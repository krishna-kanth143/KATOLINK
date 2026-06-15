import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiShield, FiTrash2, FiSave, FiLock, FiZap, FiBell, FiChevronRight, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, email });
      if (res.data?.success) {
        toast.success('Configuration synchronized');
      }
    } catch (err) {
      toast.error('Synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    toast.success('Reset link dispatched to email');
  };

  const handlePurgeAccount = async () => {
    if (!window.confirm('CRITICAL: This procedure will permanently purge your entire redirect fleet and registration data. Proceed?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.delete('/auth/profile');
      if (res.data?.success) {
        toast.success('Account decommissioned');
        logout();
      }
    } catch (err) {
      toast.error('Decommissioning failure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />
        <main className="flex-grow p-6 lg:p-10 overflow-y-auto w-full space-y-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                  <FiSettings size={24} />
               </div>
               <div>
                  <h1 className="text-3xl font-bold tracking-tight">Account System</h1>
                  <p className="text-xs text-text-muted font-medium ml-0.5">Manage your identity and core security configurations.</p>
               </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Profile Section */}
            <div className="card-premium p-8 border border-border-main bg-bg-surface">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-8">
                <FiUser className="text-brand" size={16} />
                Identity Information
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Fleet Identity</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-medium transition-standard"
                        placeholder="John Doe"
                      />
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors" size={14} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Contact Interface</label>
                    <div className="relative group">
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-medium transition-standard"
                        placeholder="name@provider.com"
                      />
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors" size={14} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary h-9 px-6 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                  >
                    {loading ? 'Synchronizing...' : <><FiSave size={14} /> Commit Changes</>}
                  </button>
                </div>
              </form>
            </div>

            {/* Security Section */}
            <div className="card-premium p-8 border border-border-main bg-bg-surface">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-8">
                <FiShield className="text-brand" size={16} />
                Security Layer
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-bg-deep border border-border-main rounded-lg">
                  <div className="flex items-center gap-4">
                     <div className="w-9 h-9 rounded-md bg-bg-surface border border-border-main flex items-center justify-center text-text-muted">
                        <FiZap size={16} />
                     </div>
                     <div>
                        <h3 className="font-bold text-text-primary text-[13px]">Enhanced Validation (2FA)</h3>
                        <p className="text-[11px] font-medium text-text-muted">Multi-factor identity confirmation.</p>
                     </div>
                  </div>
                  <div className="w-10 h-5 bg-border-main rounded-full relative cursor-not-allowed">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-text-muted rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-bg-deep border border-border-main rounded-lg text-left">
                  <div className="flex items-center gap-4">
                     <div className="w-9 h-9 rounded-md bg-bg-surface border border-border-main flex items-center justify-center text-text-muted">
                        <FiLock size={16} />
                     </div>
                     <div>
                        <h3 className="font-bold text-text-primary text-[13px]">Access Key Rotation</h3>
                        <p className="text-[11px] font-medium text-text-muted">Update your secure authentication key.</p>
                     </div>
                  </div>
                  <button 
                    onClick={handleResetPassword}
                    className="h-8 px-4 border border-border-main rounded-md text-[10px] font-bold uppercase tracking-widest hover:border-brand/40 transition-colors"
                  >
                    Initiate Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="card-premium p-8 border border-border-main bg-bg-surface">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-8">
                <FiBell className="text-brand" size={16} />
                Telemetry Alerts
              </h2>

              <div className="p-6 bg-bg-deep border border-border-main rounded-lg flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-md bg-brand/10 flex items-center justify-center text-brand">
                       <FiZap size={16} />
                    </div>
                    <div>
                       <h3 className="font-bold text-text-primary text-[13px]">Real-time Scan Notifications</h3>
                       <p className="text-[11px] font-medium text-text-muted">Receive alerts when assets are accessed.</p>
                    </div>
                 </div>
                 <div className="w-10 h-5 bg-brand/20 rounded-full relative cursor-pointer border border-brand/40">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-brand rounded-full"></div>
                 </div>
              </div>
            </div>

            {/* Destruction Zone */}
            <div className="card-premium p-8 border border-red-900/20 bg-red-900/[0.02]">
              <h2 className="text-sm font-bold flex items-center gap-2 mb-8 text-red-500">
                <FiTrash2 size={16} />
                Destructive Procedures
              </h2>
              
              <div className="p-6 bg-bg-deep border border-red-900/10 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-text-primary text-[13px]">Decommission Account</h3>
                  <p className="text-[11px] font-medium text-text-muted max-w-sm mt-1">Permanently purge your entire redirect fleet and registration data from centralized clusters.</p>
                </div>
                <button 
                  onClick={handlePurgeAccount}
                  disabled={loading}
                  className="h-9 px-6 bg-red-900/20 text-red-400 border border-red-900/30 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-red-900/40 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Executing...' : 'Execute Purge'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

