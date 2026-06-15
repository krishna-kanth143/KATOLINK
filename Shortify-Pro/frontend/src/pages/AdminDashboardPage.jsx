import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { FiUsers, FiLink, FiMousePointer, FiShield, FiUserCheck, FiCalendar, FiActivity, FiKey } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data?.success) {
          setData(res.data.data);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Admin authorization failed');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />

      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />

        <main className="flex-grow p-6 lg:p-10 overflow-y-auto w-full space-y-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                   <FiShield size={24} />
                </div>
                <div>
                   <h1 className="text-3xl font-bold tracking-tight">Fleet Registry</h1>
                   <p className="text-xs text-text-muted font-medium ml-0.5">Global resource management and administrative telemetry.</p>
                </div>
             </div>
             <div>
                <button className="btn-premium h-9 px-4 text-[10px] font-bold uppercase tracking-widest gap-2">
                   <FiKey size={14} /> Security Audit
                </button>
             </div>
          </div>

          {loading ? (
             <div className="max-w-7xl mx-auto space-y-10"><TableSkeleton /></div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
              {/* Stats Hub */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Operators" value={data?.totalUsers || 0} icon={FiUsers} description="Registered identities" growth="+5.2%" delay={0.1} />
                <StatsCard title="Global Assets" value={data?.totalUrls || 0} icon={FiLink} description="Active redirect points" growth="+12.4%" delay={0.2} />
                <StatsCard title="Infra Load" value={data?.totalClicks || 0} icon={FiMousePointer} description="Cumulative platform hits" growth="+18.7%" delay={0.3} />
                <StatsCard title="Online Registry" value={data?.activeUsers || 0} icon={FiUserCheck} description="Active sessions (24h)" growth="+3.1%" delay={0.4} />
              </div>

              {/* Recent Activity Panel */}
              <div className="card-premium overflow-hidden !p-0 border border-border-main">
                <div className="px-8 py-6 border-b border-border-main bg-bg-surface flex items-center justify-between">
                   <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                      <FiActivity className="text-brand" size={16} />
                      Deployment Log
                   </h2>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Global Feed</div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold uppercase tracking-widest text-text-muted border-b border-border-main bg-bg-surface/50">
                        <th className="px-8 py-4">Operator Identity</th>
                        <th className="px-8 py-4">Access Interface</th>
                        <th className="px-8 py-4 text-center">Clearance</th>
                        <th className="px-8 py-4 text-right">Commissioned</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                      {(data?.recentRegistrations || []).map((user) => (
                        <tr key={user._id} className="hover:bg-bg-surface transition-standard group">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-bg-deep flex items-center justify-center font-bold text-[10px] text-brand border border-border-main">
                                   {user.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="font-bold text-[13px] text-text-primary group-hover:text-brand transition-colors">{user.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-text-muted font-medium text-[11px] truncate max-w-[200px]">{user.email}</td>
                          <td className="px-8 py-5 text-center">
                             <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${user.role === 'admin' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-bg-deep text-text-muted border-border-main'}`}>
                                {user.role}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-right text-[11px] font-medium text-text-muted tabular-nums">
                             <div className="flex items-center justify-end gap-1.5">
                                <FiCalendar className="text-border-main" size={12} /> {new Date(user.createdAt).toLocaleDateString()}
                             </div>
                          </td>
                        </tr>
                      ))}
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

export default AdminDashboardPage;

