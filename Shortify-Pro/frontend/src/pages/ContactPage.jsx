import React from 'react';
import Navbar from '../components/Navbar';
import { FiMail, FiMessageSquare, FiExternalLink, FiTerminal, FiGlobe, FiSend } from 'react-icons/fi';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto py-20 lg:py-24">
          <div className="text-center mb-20">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest mb-6">
                <FiMessageSquare size={12} /> Neural Uplink
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
               Contact <span className="text-brand">Infrastructure</span>
             </h1>
             <p className="text-text-muted font-medium text-lg leading-relaxed max-w-2xl mx-auto">
               For technical emergencies, administrative inquiries, or system feedback, 
               our operator support channels are open 24/7.
             </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="card-premium p-8 border border-border-main bg-bg-surface">
               <h3 className="text-sm font-bold flex items-center gap-2 mb-8">
                  <FiTerminal className="text-brand" size={16} />
                  Direct Terminal
               </h3>
               <form className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Operator Identity</label>
                     <input type="text" className="w-full h-10 px-4 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/40 text-xs font-medium transition-standard" placeholder="Name" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Comm Channel (Email)</label>
                     <input type="email" className="w-full h-10 px-4 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/40 text-xs font-medium transition-standard" placeholder="identity@kato.link" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold uppercase tracking-widest text-text-muted ml-0.5">Transmission Content</label>
                     <textarea rows={4} className="w-full p-4 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/40 text-xs font-medium transition-standard resize-none" placeholder="Provide system logs or inquiry details..."></textarea>
                  </div>
                  <button className="btn-primary w-full h-10 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <FiSend size={14} /> Dispatch Message
                  </button>
               </form>
            </div>

            <div className="space-y-6">
               {[
                 { icon: FiMail, title: "Core Uplink", value: "support@katolink.pro" },
                 { icon: FiGlobe, title: "Global Operations", value: "US / EU / ASIA" },
                 { icon: FiExternalLink, title: "Technical Docs", value: "docs.katolink.pro" },
               ].map((item, i) => (
                 <div 
                   key={i}
                   className="p-8 bg-bg-surface border border-border-main rounded-md group hover:border-brand/40 transition-standard"
                 >
                    <div className="flex items-center gap-5">
                       <div className="w-10 h-10 rounded bg-bg-deep flex items-center justify-center text-text-muted group-hover:text-brand transition-colors border border-border-main">
                          <item.icon size={18} />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">{item.title}</p>
                          <p className="text-[15px] font-bold text-text-primary tracking-tight">{item.value}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;

