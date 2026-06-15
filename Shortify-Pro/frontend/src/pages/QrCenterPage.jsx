import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiGrid, FiActivity, FiDownload, FiShare2, FiExternalLink, 
  FiCalendar, FiArrowRight, FiCheckCircle, FiCopy, FiInfo,
  FiChevronRight, FiChevronLeft, FiSearch, FiMonitor, FiSmartphone, FiZap, FiDownloadCloud, FiSend
} from 'react-icons/fi';
import { FaWhatsapp, FaTelegram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaQrcode } from 'react-icons/fa6';
import api from '../services/api';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';

const QrCenterPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [urlsRes, analyticsRes] = await Promise.all([
        api.get('/url/user', { params: { limit: 100 } }),
        api.get('/analytics/qr')
      ]);
      console.log("QR Data Response", { urlsRes, analyticsRes });

      if (urlsRes.data?.success) {
        const data = urlsRes.data.data;
        setUrls(data);
        if (data.length > 0) setSelectedUrl(data[0]);
      }
      if (analyticsRes.data?.success) {
        setAnalytics(analyticsRes.data.data);
      }
      setRetryCount(0);
    } catch (err) {
      console.error("QR Data Error", err);
      let message = 'Failed to load assets';
      if (err.response?.status === 401) message = 'Authentication expired';
      
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchData();
        }, 2000);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Link copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadQR = (url, name, type) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR-${name}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exporting ${type.toUpperCase()}`);
  };

  const shareQR = (platform, url, title) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(`Check out this QR: ${title}`);
    const shareLinks = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
    };
    window.open(shareLinks[platform], '_blank');
  };

  const filteredUrls = urls.filter(u => 
    u.shortCode.toLowerCase().includes(search.toLowerCase()) || 
    u.originalUrl.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-deep text-text-primary flex flex-col font-sans selection:bg-brand/30">
      <Navbar />
      <div className="flex flex-col flex-grow lg:flex-row relative">
        <Sidebar />
        
        <main className="flex-grow flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          {/* Header Bar */}
          <div className="h-16 shrink-0 border-b border-border-main bg-bg-surface px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-brand/10 flex items-center justify-center text-brand">
                <FaQrcode size={16} />
              </div>
              <h1 className="text-lg font-bold tracking-tight">QR Asset Console</h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                 <span>Total Scans: <span className="text-text-primary tabular-nums">{analytics?.totalQrScans || 0}</span></span>
                 <div className="w-1 h-1 bg-border-main rounded-full"></div>
                 <span>Active Assets: <span className="text-text-primary tabular-nums">{urls.length}</span></span>
              </div>
              <button 
                onClick={fetchData}
                className="btn-premium h-8 px-3 text-[10px] font-bold uppercase tracking-widest"
              >
                Refresh Data
              </button>
            </div>
          </div>

          <div className="flex-grow flex overflow-hidden">
            {/* Left Sidebar: Asset List */}
            <div className="w-full md:w-80 lg:w-96 shrink-0 border-r border-border-main bg-bg-surface flex flex-col h-full">
              <div className="p-4 border-b border-border-main">
                <div className="relative group">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={14} />
                  <input 
                    type="text" 
                    placeholder="Filter assets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 bg-bg-deep border border-border-main rounded-md outline-none focus:border-brand/50 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-border-main/50">
                {filteredUrls.map((url) => (
                  <div 
                    key={url._id}
                    onClick={() => setSelectedUrl(url)}
                    className={`p-4 cursor-pointer transition-standard group ${selectedUrl?._id === url._id ? 'bg-bg-deep' : 'hover:bg-bg-deep/50'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${selectedUrl?._id === url._id ? 'text-brand' : 'text-text-primary'}`}>/{url.shortCode}</span>
                      <span className="text-[10px] font-bold text-text-muted tabular-nums">{url.qrScanCount || 0} hits</span>
                    </div>
                    <p className="text-[10px] text-text-muted truncate opacity-80">{url.originalUrl}</p>
                  </div>
                ))}
                {!loading && filteredUrls.length === 0 && (
                  <div className="p-12 text-center">
                    <FiInfo className="mx-auto text-text-muted mb-3" size={24} />
                    <p className="text-xs text-text-muted font-medium">No assets found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Active Configuration */}
            <div className="flex-1 bg-bg-deep overflow-y-auto">
              <AnimatePresence mode="wait">
                {selectedUrl ? (
                  <motion.div 
                    key={selectedUrl._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8"
                  >
                    <div className="flex flex-col lg:flex-row gap-10">
                      {/* QR Preview Column */}
                      <div className="w-full lg:w-64 space-y-6 shrink-0">
                         <div className="aspect-square bg-white rounded-xl p-6 shadow-xl flex items-center justify-center border border-border-main">
                            <img 
                              src={selectedUrl.qrCodeUrl} 
                              alt="Production QR" 
                              className="w-full h-full grayscale-0 contrast-125"
                            />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-3">
                           <button 
                             onClick={() => downloadQR(selectedUrl.qrCodeUrl, selectedUrl.shortCode, 'png')}
                             className="btn-premium h-10 text-[10px] gap-2 flex items-center justify-center"
                           >
                             <FiDownload size={14} /> PNG
                           </button>
                           <button 
                             onClick={() => downloadQR(selectedUrl.qrCodeUrl, selectedUrl.shortCode, 'svg')}
                             className="btn-premium h-10 text-[10px] gap-2 flex items-center justify-center"
                           >
                             <FiDownloadCloud size={14} /> SVG
                           </button>
                         </div>

                         <div className="card-premium p-4 space-y-4">
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-center border-b border-border-main pb-3 mb-3">Telemetry</p>
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-text-muted font-medium">Total Scans</span>
                               <span className="text-sm font-bold text-text-primary tabular-nums">{selectedUrl.qrScanCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                               <span className="text-xs text-text-muted font-medium">Global Clicks</span>
                               <span className="text-sm font-bold text-text-primary tabular-nums">{selectedUrl.clickCount || 0}</span>
                            </div>
                         </div>
                      </div>

                      {/* Configuration Column */}
                      <div className="flex-1 space-y-8">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-text-muted">
                              <FiCalendar size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Deployed on {new Date(selectedUrl.createdAt).toLocaleDateString()}</span>
                           </div>
                           <h2 className="text-3xl font-bold tracking-tight">QR Asset: /{selectedUrl.shortCode}</h2>
                           <div className="flex items-center gap-3 py-2">
                              <code className="text-xs bg-bg-surface px-2 py-1 rounded border border-border-main text-brand">{selectedUrl.shortUrl}</code>
                              <button 
                                onClick={() => handleCopy(selectedUrl._id, selectedUrl.shortUrl)}
                                className="text-text-muted hover:text-text-primary transition-colors"
                              >
                                {copiedId === selectedUrl._id ? <FiCheckCircle className="text-success" size={14} /> : <FiCopy size={14} />}
                              </button>
                           </div>
                        </div>

                        <div className="card-premium space-y-6">
                           <h3 className="text-sm font-bold flex items-center gap-2">
                              <FiExternalLink size={14} className="text-brand" />
                              Routing Configuration
                           </h3>
                           <div className="p-3 bg-bg-deep rounded border border-border-main">
                              <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Target Endpoint</p>
                              <p className="text-xs text-text-secondary truncate font-medium">{selectedUrl.originalUrl}</p>
                           </div>
                        </div>

                        <div className="card-premium space-y-6">
                           <h3 className="text-sm font-bold flex items-center gap-2">
                              <FiShare2 size={14} className="text-brand" />
                              Asset Distribution
                           </h3>
                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <button onClick={() => shareQR('whatsapp', selectedUrl.shortUrl, selectedUrl.shortCode)} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-deep border border-border-main hover:border-success/30 hover:bg-success/5 transition-standard group">
                                 <FaWhatsapp className="text-text-muted group-hover:text-success" size={20} />
                                 <span className="text-[9px] font-bold uppercase text-text-muted">WhatsApp</span>
                              </button>
                              <button onClick={() => shareQR('telegram', selectedUrl.shortUrl, selectedUrl.shortCode)} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-deep border border-border-main hover:border-[#229ED9]/30 hover:bg-[#229ED9]/5 transition-standard group">
                                 <FaTelegram className="text-text-muted group-hover:text-[#229ED9]" size={20} />
                                 <span className="text-[9px] font-bold uppercase text-text-muted">Telegram</span>
                              </button>
                              <button onClick={() => shareQR('linkedin', selectedUrl.shortUrl, selectedUrl.shortCode)} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-deep border border-border-main hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 transition-standard group">
                                 <FaLinkedin className="text-text-muted group-hover:text-[#0A66C2]" size={20} />
                                 <span className="text-[9px] font-bold uppercase text-text-muted">LinkedIn</span>
                              </button>
                              <button onClick={() => shareQR('email', selectedUrl.shortUrl, selectedUrl.shortCode)} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-bg-deep border border-border-main hover:border-brand/30 hover:bg-brand/5 transition-standard group">
                                 <FaEnvelope className="text-text-muted group-hover:text-brand" size={20} />
                                 <span className="text-[9px] font-bold uppercase text-text-muted">Email</span>
                              </button>
                           </div>
                        </div>

                        <div className="flex justify-end">
                           <button 
                             onClick={() => navigate(`/analytics/url/${selectedUrl._id}`)}
                             className="btn-primary h-10 px-6 text-xs font-bold gap-2"
                           >
                             Advanced Telemetry <FiArrowRight size={14} />
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <FaQrcode size={64} className="mb-6 text-text-muted" />
                    <p className="text-sm font-medium">Select an asset to configure</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QrCenterPage;
