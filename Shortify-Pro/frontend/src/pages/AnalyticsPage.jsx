import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { ClickTrendsChart, DeviceChart, GenericBarChart } from '../components/AnalyticsCharts';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { FiActivity, FiGlobe, FiSmartphone, FiHash, FiExternalLink, FiBarChart2, FiZap, FiSearch, FiTarget, FiLayers, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/dashboard');
      console.log("Analytics API Response", res);
      if (res.data?.success) {
        setData(res.data.data);
        setRetryCount(0);
      }
    } catch (err) {
      console.error("Analytics API Error", err);
      let message = 'Global telemetry stream broken';
      const status = err.response?.status;
      
      if (status === 401) message = 'Authentication expired';
      else if (status === 500) message = 'Database or API unavailable';
      else if (!err.response) message = 'Network connection lost';

      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchAnalytics();
        }, 2000);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const stats = data?.stats;
  const charts = data?.charts;

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />

      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />

        <main className="flex-grow p-6 lg:p-10 overflow-y-auto w-full space-y-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8">
             <div>
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <FiBarChart2 size={24} />
                   </div>
                   <h1 className="text-3xl font-bold tracking-tight">System Insights</h1>
                </div>
                <p className="text-xs text-text-muted font-medium ml-1.5">Platform-wide traffic telemetry and cluster performance.</p>
             </div>
             
             <div className="relative w-full md:w-80">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                <select 
                  onChange={(e) => e.target.value !== 'all' && navigate(`/analytics/url/${e.target.value}`)}
                  className="w-full h-10 pl-10 pr-4 bg-bg-surface border border-border-main rounded-md outline-none focus:border-brand/50 text-[11px] font-bold uppercase tracking-widest cursor-pointer appearance-none"
                >
                  <option value="all">Stream Specific Asset...</option>
                  {(charts?.topUrls || []).map(u => (
                    <option key={u._id} value={u._id}>/{u.shortCode} ({u.clickCount} hits)</option>
                  ))}
                </select>
             </div>
          </div>

          {loading ? (
             <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                <StatsCard title="Total Hits" value={stats?.totalClicks || 0} icon={FiActivity} description="Cumulative traffic" growth="+14.2%" delay={0.1} />
                <StatsCard title="Asset Fleet" value={stats?.totalUrls || 0} icon={FiLayers} description="Active endpoints" delay={0.2} />
                <StatsCard title="Alive State" value={stats?.activeUrls || 0} icon={FiZap} description="Functional nodes" delay={0.3} />
                <StatsCard title="QR Presence" value={stats?.qrScans || 0} icon={FiGlobe} description="Physical scans" delay={0.4} />
                <StatsCard title="Mobile Purity" value={stats?.mobilePurity || '0%'} icon={FiSmartphone} description="Handheld hits" delay={0.5} />
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="card-premium p-8 border border-border-main">
                  <h3 className="text-sm font-bold mb-8 flex items-center gap-2">
                    <FiActivity className="text-brand" size={16} />
                    Throughput Velocity
                  </h3>
                  <div className="h-[300px]"><ClickTrendsChart data={charts?.clickTrend || []} /></div>
                </div>

                <div className="card-premium p-8 border border-border-main">
                  <h3 className="text-sm font-bold mb-8 flex items-center gap-2">
                    <FiSmartphone className="text-brand" size={16} />
                    Agent Architecture
                  </h3>
                  <div className="h-[300px]"><DeviceChart data={charts?.deviceAnalytics || []} /></div>
                </div>
              </div>

              <div className="card-premium p-8 border border-border-main">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="text-sm font-bold flex items-center gap-2">
                     <FiTarget className="text-brand" size={16} />
                     Asset Performance Leaderboard
                   </h3>
                </div>

                <div className="h-[300px]"><GenericBarChart data={(charts?.topUrls || []).map(u => ({ _id: u.shortCode, count: u.clickCount }))} color="#FFA116" /></div>
                
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(charts?.topUrls || []).map((url) => (
                    <button 
                      key={url._id} 
                      onClick={() => navigate(`/analytics/url/${url._id}`)}
                      className="group p-5 rounded-md bg-bg-surface border border-border-main hover:border-brand/50 transition-standard text-left"
                    >
                      <div className="flex justify-between items-start mb-3">
                         <span className="text-[11px] font-bold text-text-muted group-hover:text-brand transition-colors">/{url.shortCode}</span>
                         <FiArrowRight className="text-border-main group-hover:text-brand -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" size={14} />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                         <span className="text-xl font-bold text-text-primary tabular-nums">{url.clickCount.toLocaleString()}</span>
                         <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">hits</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;

