import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiArrowRight } from 'react-icons/fi';

const StatsCard = ({ title, value, icon: Icon, description, growth, delay = 0 }) => {
  const isPositive = growth?.startsWith('+');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="card-premium group cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-card-hover flex items-center justify-center text-brand">
            <Icon className="w-4 h-4" />
          </div>
          <h4 className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">{title}</h4>
        </div>
        {growth && (
          <div className={`flex items-center gap-1 text-[11px] font-bold ${
            isPositive ? 'text-success' : 'text-danger'
          }`}>
            {isPositive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
            {growth}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-text-primary tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        </div>
        <div className="flex items-center justify-between group/link">
          <p className="text-xs text-text-muted font-medium transition-colors group-hover:text-text-secondary">
            {description}
          </p>
          <FiArrowRight className="text-brand opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={14} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;

