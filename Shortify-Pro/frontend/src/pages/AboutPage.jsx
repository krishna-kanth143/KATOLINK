import React from 'react';
import Navbar from '../components/Navbar';
import { FiInfo, FiLayers, FiShield, FiUsers, FiTarget } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto py-20 lg:py-24">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest mb-6">
                <FiInfo size={12} /> System Identity
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
               About <span className="text-brand">KatoLink</span>
             </h1>
             <p className="text-text-muted font-medium text-lg leading-relaxed max-w-2xl mx-auto">
               A high-performance, developer-centric URL management architecture 
               designed for precision telemetry and global scaling.
             </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: FiLayers, title: "Modern Stack", desc: "Engineered on React 19 and Tailwind v4 for sub-millisecond response and fluid interaction." },
              { icon: FiShield, title: "Encrypted Fleet", desc: "Standardized authentication and resource isolation for all redirect endpoints." },
              { icon: FiUsers, title: "Operator Focused", desc: "Clean, high-precision dashboards built for system administrators and power users." },
              { icon: FiTarget, title: "Telemetry Engine", desc: "Real-time traffic analysis and granular data visualization for every asset." },
            ].map((item, i) => (
              <div 
                key={i}
                className="card-premium p-8 border border-border-main bg-bg-surface hover:border-brand/40 transition-standard"
              >
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand mb-6">
                  <item.icon size={20} />
                </div>
                <h3 className="text-[15px] font-bold tracking-tight mb-3">{item.title}</h3>
                <p className="text-[13px] text-text-muted leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;

