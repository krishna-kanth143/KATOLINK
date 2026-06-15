import React from 'react';
import { FiAlertCircle, FiRefreshCw, FiZap } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("KatoLink Infrastructure Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FFA116]/10 flex items-center justify-center text-[#FFA116] border border-[#FFA116]/20 animate-pulse">
                <FiZap size={32} />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-bold tracking-tight">KatoLink is loading...</h1>
              <p className="text-sm text-[#9CA3AF] font-medium leading-relaxed px-4">
                The application encountered a runtime exception. We are attempting to restore the connection to your assets.
              </p>
            </div>

            <div className="p-4 bg-[#1A1A1A] border border-[#3A3A3A] rounded-xl text-left overflow-hidden">
               <div className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-[#FF375F]">
                  <FiAlertCircle size={12} /> Diagnostic Trace
               </div>
               <pre className="text-[11px] font-mono text-[#D1D5DB] whitespace-pre-wrap overflow-x-auto max-h-32 opacity-80">
                  {this.state.error?.toString() || 'Unknown Registry Error'}
               </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFA116] text-[#0F0F0F] rounded-lg font-bold text-sm hover:bg-[#FFB84D] transition-all active:scale-95 shadow-lg shadow-[#FFA116]/10"
            >
              <FiRefreshCw size={16} /> Re-initialize App
            </button>
            
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#3A3A3A]">
               KatoLink Infrastructure v4.0
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

