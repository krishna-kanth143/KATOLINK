import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { ClickTrendsChart, DeviceChart, CountryChart } from '../components/AnalyticsCharts';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { 
  FiMousePointer, FiGlobe, FiSmartphone, 
  FiClock, FiArrowLeft, FiMapPin, FiCpu, FiHash, FiActivity, FiShield, FiCalendar, FiBox, FiExternalLink, FiShare2, FiTrash2, FiSave, FiCheck, FiX, FiArrowRight
} from 'react-icons/fi';

const UrlAnalyticsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/analytics/url/${id}`);
      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (error) {
      toast.error('Telemetry stream inaccessible');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await api.put(`/url/${id}`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Endpoint state: ${newStatus}`);
        fetchAnalytics();
      }
    } catch (err) {
      toast.error('Failed to update endpoint state');
    }
  };

  const handleExtendExpiration = async (days) => {
    try {
      const current = data?.url?.expiresAt ? new Date(data.url.expiresAt) : new Date();
      const newExpiry = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
      const res = await api.put(`/url/${id}`, { expiresAt: newExpiry, status: 'active' });
      if (res.data?.success) {
        toast.success('Lifecycle extended');
        fetchAnalytics();
      }
    } catch (err) {
      toast.error('Extension failed');
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />

      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />

        <main className="flex-grow p-6 lg:p-10 overflow-y-auto w-full space-y-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-4">
                <Link to="/my-urls" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-brand transition-colors">
                   <FiArrowLeft /> Return to Assets
                </Link>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <FiActivity size={24} />
                   </div>
                   <div>
                      <h1 className="text-3xl font-bold tracking-tight">Endpoint Analytics</h1>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-xs font-bold text-brand">/{data?.url?.shortCode || '...'}</span>
                         <div className="w-1 h-1 bg-border-main rounded-full"></div>
                         <a href={data?.url?.originalUrl} target="_blank" rel="noreferrer" className="text-[10px] font-medium text-text-muted hover:text-text-primary truncate max-w-sm flex items-center gap-1">
                            {data?.url?.originalUrl} <FiExternalLink size={10} />
                         </a>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="flex gap-3">
                <button className="btn-premium h-9 px-4 text-[10px] font-bold uppercase tracking-widest gap-2">
                   <FiShare2 size={14} /> Share Report
                </button>
             </div>
          </div>

          {loading ? (
             <div className="max-w-7xl mx-auto space-y-10"><TableSkeleton /></div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Summary Cards */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Hits" value={data?.url?.clickCount || 0} icon={FiActivity} description="Lifetime reach" growth="+8%" delay={0.1} />
                <StatsCard title="QR Presence" value={data?.url?.qrScanCount || 0} icon={FiGlobe} description="Scanner engagement" growth="+12%" delay={0.2} />
                <StatsCard title="Endpoint Status" value={data?.url?.status?.toUpperCase()} icon={FiShield} description="Network availability" delay={0.3} />
                <StatsCard title="Deployment" value={new Date(data?.url?.createdAt).toLocaleDateString()} icon={FiCalendar} description="Original timestamp" delay={0.4} />
              </div>

              {/* Visualization Grid */}
              <div className="grid gap-8 lg:grid-cols-2">
                 <div className="card-premium p-8 border border-border-main">
                    <h3 className="text-sm font-bold mb-8 flex items-center gap-2">
                      <FiActivity className="text-brand" size={16} />
                      Traffic Distribution
                    </h3>
                    <div className="h-[300px]"><ClickTrendsChart data={data?.dailyClicks || []} /></div>
                 </div>
                 
                 <div className="card-premium p-8 border border-border-main">
                    <h3 className="text-sm font-bold mb-8 flex items-center gap-2">
                      <FiSmartphone className="text-brand" size={16} />
                      Component Infrastructure
                    </h3>
                    <div className="h-[300px]"><DeviceChart data={data?.deviceAnalytics || []} /></div>
                 </div>
              </div>

              <div className="card-premium p-8 border border-border-main">
                 <h3 className="text-sm font-bold mb-8 flex items-center gap-2">
                   <FiGlobe className="text-brand" size={16} />
                   Geographic Clusters
                 </h3>
                 <div className="h-[300px]"><CountryChart data={data?.countryAnalytics || []} /></div>
              </div>

              {/* Management Layer */}
              <div className="card-premium p-8 border border-border-main bg-bg-surface/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <FiShield className="text-brand" size={16} />
                      Lifecycle Management
                    </h3>
                    <p className="text-[11px] text-text-muted font-medium max-w-sm">
                      Manually control endpoint availability and extend operational lifespan.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex bg-bg-deep p-1 rounded-lg border border-border-main">
                      <button 
                        onClick={() => handleUpdateStatus('active')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${data?.url?.status === 'active' ? 'bg-success text-white' : 'text-text-muted hover:text-text-primary'}`}
                      >
                         Active
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus('disabled')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${data?.url?.status === 'disabled' ? 'bg-danger text-white' : 'text-text-muted hover:text-text-primary'}`}
                      >
                         Disable
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Extend:</span>
                      <button onClick={() => handleExtendExpiration(7)} className="h-9 px-3 rounded-md bg-bg-deep border border-border-main text-[10px] font-bold hover:border-brand/50 transition-colors">7d</button>
                      <button onClick={() => handleExtendExpiration(30)} className="h-9 px-3 rounded-md bg-bg-deep border border-border-main text-[10px] font-bold hover:border-brand/50 transition-colors">30d</button>
                      <button onClick={() => handleExtendExpiration(90)} className="h-9 px-3 rounded-md bg-bg-deep border border-border-main text-[10px] font-bold hover:border-brand/50 transition-colors">90d</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* History Data Table */}
              <div className="card-premium overflow-hidden !p-0 border border-border-main">
                <div className="px-8 py-6 border-b border-border-main bg-bg-surface flex items-center justify-between">
                   <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                      <FiClock className="text-brand" size={16} />
                      Historical Telemetry
                   </h2>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Live Stream</div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-main bg-bg-surface/50">
                        <th className="px-8 py-4">Timestamp</th>
                        <th className="px-8 py-4">Agent Module</th>
                        <th className="px-8 py-4">Regional Identity</th>
                        <th className="px-8 py-4 text-right">Environment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                      {(data?.clickHistory || []).map((item) => (
                        <tr key={item._id} className="hover:bg-bg-surface transition-standard group">
                          <td className="px-8 py-5 text-[11px] font-medium text-text-secondary tabular-nums">{new Date(item.timestamp).toLocaleString()}</td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-2.5 text-[11px] font-bold text-text-primary">
                                <div className="w-7 h-7 rounded bg-bg-deep flex items-center justify-center border border-border-main">
                                  <FiCpu className="text-text-muted" size={14} />
                                </div>
                                {item.deviceType || 'System'}
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-2.5 text-[11px] font-bold text-text-primary">
                                <div className="w-7 h-7 rounded bg-bg-deep flex items-center justify-center border border-border-main">
                                  <FiMapPin className="text-text-muted" size={14} />
                                </div>
                                {item.city || 'Private'}, {item.country || 'Global'}
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                             {item.browser} <span className="mx-2 text-border-main">•</span> {item.os}
                          </td>
                        </tr>
                      ))}
                      {(!data?.clickHistory || data.clickHistory.length === 0) && (
                        <tr>
                          <td colSpan="4" className="px-8 py-20 text-center text-xs text-text-muted font-medium italic">No telemetry data available for this endpoint.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UrlAnalyticsPage;

