import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, FiLink, FiBarChart2, FiSettings, FiShield, 
  FiChevronLeft, FiPlus, FiUser, FiBell, FiSearch, FiZap
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
    { name: 'Links', path: '/my-urls', icon: FiLink },
    { name: 'QR Center', path: '/qr-center', icon: FaQrcode },
    { name: 'Analytics', path: '/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/settings', icon: FiSettings },
    { name: 'Profile', path: '/profile', icon: FiUser }
  ];

  if (user && user.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: FiShield });
  }

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      className="hidden sm:flex flex-col h-[calc(100vh-4rem)] sticky top-16 bg-bg-surface border-r border-border-main transition-all duration-200 z-40"
    >
      {/* Navigation Items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-standard group relative ${
                isActive
                  ? 'text-brand bg-brand/10 border-l-2 border-brand rounded-l-none'
                  : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border-main">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full h-10 flex items-center justify-center rounded-md hover:bg-card-hover transition-standard text-text-muted hover:text-text-primary"
        >
          <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
            <FiChevronLeft size={18} />
          </motion.div>
          {!isCollapsed && <span className="ml-2 text-xs font-semibold">Collapse</span>}
        </button>
      </div>

      {/* User Footer Area */}
      {!isCollapsed && (
        <div className="p-4 bg-bg-deep border-t border-border-main">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-md bg-brand text-bg-deep flex items-center justify-center text-xs font-black shrink-0">
               {user?.name?.substring(0, 1) || 'U'}
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-text-primary">{user?.name || 'User'}</p>
                <p className="text-[10px] text-text-muted truncate uppercase tracking-widest">{user?.role || 'Member'}</p>
             </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;

