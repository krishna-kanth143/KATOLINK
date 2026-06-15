import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { 
  FiSearch, FiFilter, FiCopy, FiCheck,
  FiTrash2, FiUpload, FiExternalLink, FiBarChart2, FiCalendar, FiTarget, FiMoreVertical
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MyUrlsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [copiedId, setCopiedId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const [showBulkModal, setShowBulkModal] = useState(false);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await api.get('/url/user', {
        params: { page, limit: 10, search, status: statusFilter }
      });
      console.log("MyUrls API Response", res);
      if (res.data?.success) {
        setUrls(res.data.data);
        setPagination(res.data.pagination || { totalPages: 1 });
        setRetryCount(0);
      }
    } catch (err) {
      console.error("MyUrls API Error", err);
      let message = 'Failed to load URLs';
      const status = err.response?.status;
      
      if (status === 401) message = 'Authentication expired';
      else if (status === 500) message = 'Database or API unavailable';

      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchUrls();
        }, 2000);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUrls();
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Link copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this redirect point?')) return;
    try {
      const res = await api.delete(`/url/${id}`);
      if (res.data?.success) {
        toast.success('Record deleted');
        fetchUrls();
      }
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />
        <main className="flex-grow p-4 lg:p-8 overflow-y-auto w-full space-y-6">
          {/* Header */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
               <h1 className="text-2xl font-semibold tracking-tight">Deployment History</h1>
               <p className="text-sm text-text-muted">Manage and audit your active redirect infrastructure.</p>
            </div>
            
            <button 
              onClick={() => setShowBulkModal(true)} 
              className="btn-primary h-9 px-4 text-xs font-semibold"
            >
              <FiUpload size={14} className="mr-1.5" /> Bulk Import
            </button>
          </div>

          {/* Filters Bar */}
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative group">
              <input 
                type="text" 
                placeholder="Search by code or destination..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full h-10 pl-10 pr-4 bg-bg-surface border border-border-main rounded-lg outline-none focus:border-brand/50 text-xs font-medium" 
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={16} />
            </form>
            
            <div className="relative">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="h-10 pl-4 pr-10 bg-bg-surface border border-border-main rounded-lg outline-none focus:border-brand/50 text-xs font-bold uppercase tracking-tight cursor-pointer appearance-none"
              >
                <option value="all">Infrastructure: All</option>
                <option value="active">State: Active</option>
                <option value="expired">State: Expired</option>
                <option value="disabled">State: Disabled</option>
              </select>
              <FiFilter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
            </div>
          </div>

          {/* Table */}
          <div className="max-w-7xl mx-auto">
            {loading ? <TableSkeleton /> : urls.length === 0 ? (
              <div className="card-premium py-20 flex flex-col items-center justify-center border-dashed">
                <FiExternalLink className="h-10 w-10 text-text-muted mb-4 opacity-20" />
                <h3 className="text-lg font-semibold text-text-secondary">No Records Found</h3>
                <p className="text-xs text-text-muted mt-1">Start by deploying your first short link.</p>
              </div>
            ) : (
              <div className="border border-border-main rounded-xl overflow-hidden bg-bg-surface">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-card-bg border-b border-border-main text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        <th className="px-6 py-4">Short Code</th>
                        <th className="px-6 py-4">Original URL</th>
                        <th className="px-6 py-4 text-center">Hits</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Created At</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                      {urls.map((url) => (
                        <tr key={url._id} className="hover:bg-bg-deep transition-standard group">
                          <td className="px-6 py-4">
                            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-brand hover:underline flex items-center gap-1.5 text-sm">
                              /{url.shortCode} <FiExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="px-6 py-4">
                             <p className="truncate max-w-[300px] text-xs text-text-secondary font-medium">
                               {url.originalUrl}
                             </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className="text-sm font-bold text-text-primary tabular-nums">{url.clickCount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                              url.status === 'active' ? 'bg-success/10 text-success border-success/20' : 
                              url.status === 'expired' ? 'bg-danger/10 text-danger border-danger/20' :
                              'bg-text-muted/10 text-text-muted border-border-main'
                            }`}>
                               {url.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs text-text-muted font-medium">{new Date(url.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleCopy(url._id, url.shortUrl)} 
                                  className="p-2 rounded-md hover:bg-bg-deep text-text-muted hover:text-text-primary transition-standard"
                                  title="Copy Link"
                                >
                                   {copiedId === url._id ? <FiCheck className="text-success" /> : <FiCopy />}
                                </button>
                                <button 
                                  onClick={() => navigate(`/analytics/url/${url._id}`)} 
                                  className="p-2 rounded-md hover:bg-bg-deep text-text-muted hover:text-text-primary transition-standard"
                                  title="View Stats"
                                >
                                   <FiBarChart2 />
                                </button>
                                <button 
                                  onClick={() => navigate(`/qr-center`)} 
                                  className="p-2 rounded-md hover:bg-bg-deep text-text-muted hover:text-text-primary transition-standard"
                                  title="QR Code"
                                >
                                   <FaQrcode />
                                </button>
                                <button 
                                  onClick={() => handleDelete(url._id)} 
                                  className="p-2 rounded-md hover:bg-bg-deep hover:text-danger text-text-muted transition-standard"
                                  title="Delete"
                                >
                                   <FiTrash2 />
                                </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 bg-card-bg border-t border-border-main flex items-center justify-between">
                     <span className="text-xs text-text-muted font-medium">Page {page} of {pagination.totalPages}</span>
                     <div className="flex gap-2">
                        <button 
                          className="btn-premium h-8 px-3 text-[11px]" 
                          disabled={page === 1} 
                          onClick={() => setPage(page-1)}
                        >
                          Prev
                        </button>
                        <button 
                          className="btn-premium h-8 px-3 text-[11px]" 
                          disabled={page === pagination.totalPages} 
                          onClick={() => setPage(page+1)}
                        >
                          Next
                        </button>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyUrlsPage;
