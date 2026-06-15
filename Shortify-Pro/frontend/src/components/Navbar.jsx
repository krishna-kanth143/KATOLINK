import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  FiSun, FiMoon, FiLogOut, FiZap, FiBell, FiSearch, FiPlus, FiChevronDown 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { logout, isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-main bg-bg-surface/80 backdrop-blur-md transition-standard">
      <div className="mx-auto max-w-full px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8 flex-1">
            <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-bg-deep shadow-lg group-hover:scale-110 transition-standard">
                <FiZap className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-black tracking-tighter text-text-primary">
                Kato<span className="text-brand">Link</span>
              </span>
            </Link>

            {/* Global Search (LeetCode Style) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center flex-1 max-w-sm relative group">
                <FiSearch className="absolute left-3 text-text-muted group-focus-within:text-brand transition-colors" size={14} />
                <input 
                  type="text" 
                  placeholder="Instant Search (⌘K)"
                  className="w-full h-9 pl-9 pr-3 bg-card-bg border border-border-main rounded-md outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 text-xs font-medium transition-standard"
                />
              </div>
            )}
          </div>

          {/* User Operations */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-card-hover transition-standard relative">
                  <FiBell size={18} />
                  <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand rounded-full"></span>
                </button>

                <div className="h-6 w-[1px] bg-border-main hidden sm:block"></div>

                <div className="flex items-center gap-2.5 p-1 rounded-md hover:bg-card-hover transition-standard cursor-pointer group">
                   <div className="w-7 h-7 rounded-sm bg-brand text-bg-deep flex items-center justify-center font-black text-[10px]">
                     {user?.name?.substring(0, 1) || 'U'}
                   </div>
                   <FiChevronDown className="text-text-muted group-hover:text-text-primary transition-colors" size={12} />
                </div>

                <button 
                  onClick={handleLogout}
                  className="h-9 px-3 rounded-md text-danger hover:bg-danger/10 transition-standard text-[10px] font-black uppercase tracking-widest"
                >
                  <FiLogOut className="inline mr-1.5" /> Log Out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary h-9 px-4 text-xs">Get Started</Link>
              </div>
            )}

            <div className="h-6 w-[1px] bg-border-main"></div>

            <button
              onClick={toggleTheme}
              className="h-9 w-9 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-card-hover transition-standard"
            >
              {theme === 'dark' ? <FiSun className="text-brand" size={18} /> : <FiMoon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

