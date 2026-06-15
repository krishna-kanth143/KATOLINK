import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiBarChart2, FiShield, FiExternalLink, FiLayers, FiCode, FiActivity, FiServer, FiTerminal } from 'react-icons/fi';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary selection:bg-brand/30 overflow-x-hidden font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-border-main">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border-main bg-bg-surface text-[11px] font-bold uppercase tracking-wider text-brand mb-8 shadow-sm">
                 <FiTerminal size={14} /> 
                 Next-Gen Redirect Engine v4.0 is live
              </div>

              <h1 className="text-5xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
                Modern <span className="text-brand">Redirect</span> <br />
                Infrastructure for Teams.
              </h1>

              <p className="max-w-2xl text-lg lg:text-xl text-text-muted font-medium mb-12 leading-relaxed">
                Deploy high-performance short links and track telemetry in real-time. 
                Built for developers who demand precision, speed, and absolute reliability.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="btn-primary h-12 px-8 text-sm font-bold shadow-lg shadow-brand/10 w-full sm:w-auto"
                >
                  Get Started for Free <FiArrowRight className="ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="btn-premium h-12 px-8 text-sm font-bold w-full sm:w-auto"
                >
                  View Documentation
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: FiZap, 
                title: "Edge Delivery", 
                desc: "Sub-millisecond redirect latency via our globally distributed edge architecture."
              },
              { 
                icon: FiActivity, 
                title: "Real-time Ops", 
                desc: "Live click telemetry with deep-dive device and geographic distribution analytics."
              },
              { 
                icon: FiShield, 
                title: "Protocol Security", 
                desc: "Protect redirect points with dynamic expiration and advanced encryption protocols."
              },
              { 
                icon: FiLayers, 
                title: "QR Ecosystem", 
                desc: "Generate professional, high-resolution QR codes compatible with all scanning systems."
              },
              { 
                icon: FiCode, 
                title: "Developer First", 
                desc: "Clean API, custom aliasing, and robust management tools for complex workflows."
              },
              { 
                icon: FiServer, 
                title: "Scalable Fleet", 
                desc: "Manage thousands of redirect endpoints with zero performance degradation."
              },
            ].map((item, i) => (
              <div 
                key={i} 
                className="card-premium p-8 border border-border-main hover:border-brand/50 transition-standard cursor-default group"
              >
                <div className="w-10 h-10 rounded-lg bg-bg-surface flex items-center justify-center mb-6 text-brand">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-text-primary tracking-tight">{item.title}</h3>
                <p className="text-sm text-text-muted font-medium leading-relaxed group-hover:text-text-secondary transition-colors">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof Section */}
        <section className="py-24 border-y border-border-main bg-bg-surface">
           <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-12 text-center">
                 <div className="space-y-1">
                    <p className="text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">4.2M</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Managed Redirects</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-4xl lg:text-5xl font-bold text-brand tracking-tight">99.99%</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">Uptime Protocol</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">120K+</p>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">QR Ecosystem Hits</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 lg:px-8 text-center bg-bg-deep relative overflow-hidden">
           <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-text-primary mb-8 leading-tight">Ready to deploy your <br /><span className="text-brand">infrastructure?</span></h2>
              <p className="text-lg text-text-muted font-medium mb-10 max-w-xl mx-auto">Join a community of developers scaling their reach with KatoLink.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary h-12 px-10 text-sm font-bold w-full sm:w-auto">Create Free Account</Link>
                <Link to="/login" className="btn-premium h-12 px-10 text-sm font-bold w-full sm:w-auto">Operator Login</Link>
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border-main bg-bg-surface text-text-muted font-sans">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2.5">
             <div className="w-8 h-8 rounded-md bg-brand/10 flex items-center justify-center text-brand">
                <FiZap size={16} />
             </div>
             <span className="text-lg font-bold tracking-tight text-text-primary">Kato<span className="text-brand">Link</span></span>
          </div>
          
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-wider">
             <span className="hover:text-text-primary transition-colors cursor-pointer">Privacy</span>
             <span className="hover:text-text-primary transition-colors cursor-pointer">Terms</span>
             <span className="hover:text-text-primary transition-colors cursor-pointer">Security</span>
          </div>
          
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-60">
             © 2026 KatoLink Infrastructure
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

