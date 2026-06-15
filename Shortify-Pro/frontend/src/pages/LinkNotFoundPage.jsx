import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FiAlertTriangle, FiArrowRight, FiZap } from 'react-icons/fi';

const LinkNotFoundPage = () => {
  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6 bg-bg-deep">
        <div className="w-full max-w-lg text-center">
          <div className="card-premium p-10 lg:p-12 border border-border-main bg-bg-surface relative overflow-hidden">
             <div className="text-8xl font-bold text-brand opacity-10 tracking-tighter select-none mb-4">404</div>
             
             <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-text-primary mb-6">
                Registry <span className="text-brand">Miss</span>
             </h1>
             
             <p className="text-text-muted font-medium text-[15px] leading-relaxed mb-10 max-w-sm mx-auto">
                The digital asset or redirect point you are seeking does not exist in 
                our current registry clusters.
             </p>
             
             <div className="space-y-4">
                <Link to="/" className="btn-primary w-full h-10 text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                   Return to Terminal <FiArrowRight size={14} />
                </Link>
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
                   <FiZap className="text-brand/50" /> KatoLink Infrastructure
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LinkNotFoundPage;

