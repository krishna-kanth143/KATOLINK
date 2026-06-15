import React from 'react';
import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="card-premium h-[200px] animate-pulse relative overflow-hidden bg-white/5 border-white/5">
    <div className="flex justify-between items-start mb-8">
      <div className="w-12 h-12 bg-white/5 rounded-xl"></div>
      <div className="w-16 h-7 bg-white/5 rounded-full"></div>
    </div>
    <div className="w-24 h-3 bg-white/5 rounded-full mb-4"></div>
    <div className="w-32 h-10 bg-white/5 rounded-xl"></div>
    
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
  </div>
);

export const TableSkeleton = () => (
  <div className="card-premium !p-0 overflow-hidden animate-pulse relative">
    <div className="h-16 bg-white/5 border-b border-white/5"></div>
    {[1,2,3,4,5,6].map(i => (
      <div key={i} className="h-24 bg-transparent border-b border-white/5 flex items-center px-10 gap-8">
        <div className="w-10 h-10 bg-white/5 rounded-xl"></div>
        <div className="flex-1 space-y-3">
          <div className="w-40 h-4 bg-white/5 rounded-full"></div>
          <div className="w-60 h-2 bg-white/5 rounded-full opacity-50"></div>
        </div>
        <div className="w-20 h-8 bg-white/5 rounded-xl"></div>
        <div className="w-24 h-10 bg-white/5 rounded-xl ml-auto"></div>
      </div>
    ))}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>
  </div>
);
