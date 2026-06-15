import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { connectSocket, disconnectSocket } from '../services/socket';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import { ClickTrendsChart } from '../components/AnalyticsCharts';
import { CardSkeleton } from '../components/LoadingSkeleton';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  FiMousePointer, FiLink, FiCheckSquare, 
  FiUsers, FiPlus, FiActivity, FiZap, FiHash, FiGlobe, FiSmartphone, FiBarChart2,
  FiArrowRight, FiCommand, FiInfo, FiExternalLink, FiSearch, FiClock, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activeVisitors, setActiveVisitors] = useState(1);
  
  const [longUrl, setLongUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryPreset, setExpiryPreset] = useState('none');
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [shortenLoading, setShortenLoading] = useState(false);

  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDashboardStats = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setErrorMessage('');
    
    try {
      const res = await api.get('/analytics/dashboard');
      console.log("Dashboard API Response", res);
      
      if (res.data?.success) {
        setStats(res.data.data.stats);
        setCharts(res.data.data.charts);
        setRetryCount(0); // Reset on success
      }
    } catch (err) {
      console.error("Dashboard API Error", err);
      
      let message = 'Dashboard metrics unavailable';
      const status = err.response?.status;
      
      if (status === 401) message = 'Authentication expired';
      else if (status === 403) message = 'Access forbidden';
      else if (status === 404) message = 'Analytics engine offline';
      else if (status === 500) message = 'Database service unavailable';
      else if (!err.response) message = 'No activity yet';

      setErrorMessage(message);

      if (retryCount < 3) {
        const timer = setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDashboardStats(isSilent);
        }, 2000 * (retryCount + 1));
        return () => clearTimeout(timer);
      } else {
        toast.error(message);
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };
// this is very imporatnt beacause this notice and do the side effect

  useEffect(() => {
    fetchDashboardStats();
    if (token) {
      const socket = connectSocket(token);
      socket.on('active_visitors', (data) => data?.count !== undefined && setActiveVisitors(data.count));
      socket.on('click_update', (data) => {
        toast.success(`Live Click: ${data.recentClick?.urlId?.shortCode || 'Someone'} just visited!`, { id: 'click-notif' });
        fetchDashboardStats(true);
      });
    }
    return () => { disconnectSocket(); };
  }, [token]);

  const handleQuickShorten = async (e) => {
    e.preventDefault();
    if (!longUrl) return;
    let targetUrl = longUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'http://' + targetUrl;

    setShortenLoading(true);
    try {
      const payload = {
        originalUrl: targetUrl,
        customAlias: customAlias.trim() || undefined,
        expiryPreset: expiryPreset !== 'none' ? expiryPreset : undefined,
        customExpiryDate: expiryPreset === 'custom' && customExpiryDate ? customExpiryDate : undefined
      };
      const res = await api.post('/url/create', payload);
      if (res.data?.success) {
        setLongUrl('');
        setCustomAlias('');
        setExpiryPreset('none');
        setCustomExpiryDate('');
        toast.success('Short Link Created successfully!');
        fetchDashboardStats(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create link');
    } finally {
      setShortenLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />
        
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto w-full space-y-8">
          {/* Header & Quick Action */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h1 className="text-2xl font-semibold tracking-tight">KatoLink Dashboard</h1>
               <p className="text-sm text-text-muted">Monitor and deploy redirect endpoints in real-time.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-main text-xs font-semibold">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-success">{activeVisitors} Online Now</span>
              </div>
              <button 
                onClick={() => navigate('/my-urls')}
                className="btn-premium h-9 px-4 text-xs font-semibold"
              >
                Manage History
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Quick Shorten Bar */}
            <form onSubmit={handleQuickShorten} className="bg-bg-surface border border-border-main rounded-xl p-6 flex flex-col gap-5 shadow-lg">
               <div className="flex flex-col md:flex-row gap-4">
                 <div className="flex-1 relative group">
                    <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
                    <input 
                      type="url" 
                      required 
                      value={longUrl} 
                      onChange={(e) => setLongUrl(e.target.value)} 
                      placeholder="Enter destination URL..." 
                      className="w-full h-11 pl-10 pr-3 bg-card-bg border border-border-main rounded-lg outline-none focus:border-brand/50 text-sm font-medium" 
                    />
                 </div>
                 <div className="w-full md:w-56 relative group">
                    <FiArrowRight className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
                    <input 
                      type="text" 
                      value={customAlias} 
                      onChange={(e) => setCustomAlias(e.target.value)} 
                      placeholder="Custom Alias (Optional)" 
                      className="w-full h-11 pl-10 pr-3 bg-card-bg border border-border-main rounded-lg outline-none focus:border-brand/50 text-sm font-medium" 
                    />
                 </div>
               </div>

               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-border-main/50 pt-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Redirection Life</label>
                      <select 
                        value={expiryPreset} 
                        onChange={(e) => setExpiryPreset(e.target.value)}
                        className="h-9 px-3 bg-card-bg border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-semibold cursor-pointer"
                      >
                        <option value="none">Never Expire</option>
                        <option value="1d">1 Day</option>
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                        <option value="custom">Custom Schedule</option>
                      </select>
                    </div>

                    {expiryPreset === 'custom' && (
                      <div className="space-y-1.5 animate-in fade-in slide-in-from-left-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted px-1">Select Termination</label>
                        <input 
                          type="datetime-local" 
                          value={customExpiryDate}
                          onChange={(e) => setCustomExpiryDate(e.target.value)}
                          className="h-9 px-3 bg-card-bg border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-semibold"
                        />
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    disabled={shortenLoading} 
                    className="btn-primary h-11 px-8 text-sm font-bold min-w-[160px] shadow-lg shadow-brand/20"
                  >
                    {shortenLoading ? "Establishing..." : "Deploy Link"}
                  </button>
               </div>
            </form>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
              </div>
            ) : (errorMessage && retryCount >= 3) || (!loading && !stats?.totalLinks) ? (
              <div className="card-premium p-12 text-center border-dashed flex flex-col items-center justify-center space-y-4">
                 <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-brand">
                    {stats?.totalLinks === 0 ? <FiLink size={24} /> : <FiAlertCircle size={24} />}
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-lg font-bold text-text-primary">
                      {(!stats || stats.totalLinks === 0) ? 'No links created yet' : errorMessage}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {(!stats || stats.totalLinks === 0) 
                        ? 'Deploy your first short link to initialize clusters and stream telemetry.' 
                        : 'The telemetry engine reported a failure while streaming cluster metrics.'}
                    </p>
                 </div>
                 {stats?.totalLinks === 0 ? (
                   <button 
                     onClick={() => navigate('/my-urls')} 
                     className="btn-primary px-6 h-9 text-[10px] font-bold uppercase tracking-widest"
                   >
                      Create First Link
                   </button>
                 ) : (
                   <button 
                     onClick={() => { setRetryCount(0); fetchDashboardStats(); }} 
                     className="btn-premium px-6 h-9 text-[10px] font-bold uppercase tracking-widest"
                   >
                      Retry Connection
                   </button>
                 ) }
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                  <StatsCard title="Total Links" value={stats?.totalLinks || 0} icon={FiHash} description="Total created" />
                  <StatsCard title="Active" value={stats?.activeUrls || 0} icon={FiZap} description="Live endpoints" />
                  <StatsCard title="Expired" value={stats?.expiredUrls || 0} icon={FiClock} description="Lifecycle end" />
                  <StatsCard title="Disabled" value={stats?.disabledUrls || 0} icon={FiAlertCircle} description="Manual off" />
                  <StatsCard title="QR ecosystem" value={stats?.qrScans || 0} icon={FiGlobe} description="Scan tracking" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Traffic Chart */}
                  <div className="card-premium lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <FiActivity className="text-brand" size={18} />
                        <h3 className="text-base font-semibold">Deployment Traffic</h3>
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-text-muted border border-border-main px-2 py-0.5 rounded bg-bg-deep">
                        30 Day Trace
                      </div>
                    </div>
                    <div className="h-[300px] flex items-center justify-center">
                      {(charts?.clickTrend || []).length > 0 ? (
                        <ClickTrendsChart data={charts?.clickTrend || []} />
                      ) : (
                        <div className="text-center space-y-2">
                           <FiActivity className="mx-auto text-text-muted opacity-20" size={40} />
                           <p className="text-xs text-text-muted font-medium">No traffic detected in the last 30 days.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card-premium h-full overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-6 shrink-0">
                      <FiZap className="text-brand" size={18} />
                      <h3 className="text-base font-semibold">Latest Deployments</h3>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide flex-1">
                      {(charts?.recentUrls || []).length > 0 ? (charts?.recentUrls || []).map((url) => (
                        <div 
                          key={url._id}
                          onClick={() => navigate(`/analytics/url/${url._id}`)}
                          className="p-3 rounded-lg bg-card-bg border border-border-main hover:border-brand/30 transition-standard cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-text-primary">/{url.shortCode}</span>
                            <span className="text-[10px] font-bold text-text-muted">{url.clickCount} hits</span>
                          </div>
                          <p className="text-[10px] text-text-muted truncate opacity-80">{url.originalUrl}</p>
                        </div>
                      )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-2">
                           <FiLink size={24} className="text-text-muted" />
                           <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No Deployments</p>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => navigate('/my-urls')}
                      className="mt-6 w-full py-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-brand transition-colors text-center shrink-0 border-t border-border-main pt-4"
                    >
                      View Deployment Log <FiArrowRight className="inline ml-1" />
                    </button>
                  </div>

                  {/* Recently Expired Widget */}
                  <div className="card-premium h-full overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-6 shrink-0 text-danger">
                      <FiClock size={18} />
                      <h3 className="text-base font-semibold">Automatic Terminations</h3>
                    </div>
                    
                    <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide flex-1">
                      {(charts?.recentUrls || []).filter(u => u.status === 'expired').length > 0 ? (charts?.recentUrls || []).filter(u => u.status === 'expired').map((url) => (
                        <div 
                          key={url._id}
                          onClick={() => navigate(`/analytics/url/${url._id}`)}
                          className="p-3 rounded-lg bg-card-bg border border-border-main hover:border-danger/30 transition-standard cursor-pointer group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-text-primary">/{url.shortCode}</span>
                            <span className="text-[10px] font-bold text-danger">Life Ended</span>
                          </div>
                          <p className="text-[10px] text-text-muted truncate opacity-80">{new Date(url.expiresAt).toLocaleDateString()}</p>
                        </div>
                      )) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-2">
                           <FiCheckSquare size={24} className="text-text-muted" />
                           <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No Expired Assets</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;

