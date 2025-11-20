
import React from 'react';
import { RegulatoryReport } from '../types';
import { X, FileText, CheckCircle2, AlertTriangle, Clock, UploadCloud, FileCode } from 'lucide-react';

interface ReportDetailModalProps {
  report: RegulatoryReport;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case '校验通过': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case '校验失败': return 'text-red-600 bg-red-50 border-red-100';
      case '上传成功': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '校验通过': return <CheckCircle2 size={16} />;
      case '校验失败': return <AlertTriangle size={16} />;
      case '上传成功': return <UploadCloud size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileCode size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">监管报文详情</h2>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{report.fileName}</p>
                </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">报送类型</p>
                    <p className="font-medium text-slate-700">{report.type}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">包含交易数</p>
                    <p className="font-medium text-slate-700">{report.transactionCount} 笔</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 mb-1">报送时间</p>
                    <p className="font-medium text-slate-700 text-sm">{report.reportDate}</p>
                </div>
                <div className={`p-3 rounded-lg border flex flex-col justify-center ${getStatusColor(report.status)}`}>
                    <p className="text-xs opacity-70 mb-1">当前状态</p>
                    <div className="font-bold flex items-center gap-1.5">
                        {getStatusIcon(report.status)}
                        {report.status}
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                        <FileText size={16} className="text-blue-500" /> 
                        中心反馈回执 (Receipt)
                    </h3>
                    {report.feedbackTime && (
                         <span className="text-xs text-slate-400">接收时间: {report.feedbackTime}</span>
                    )}
                </div>
                
                {report.feedbackContent ? (
                    <div className="bg-[#1e1e1e] text-slate-300 p-4 overflow-x-auto">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 pb-2 border-b border-slate-700 font-mono">
                            <span>Filename: {report.feedbackFileName}</span>
                        </div>
                        <pre className="font-mono text-xs leading-relaxed text-green-400 whitespace-pre-wrap">
                            {report.feedbackContent}
                        </pre>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        <Clock className="mx-auto mb-2 opacity-50" size={24} />
                        暂未收到监管中心反馈的回执报文。
                        <p className="text-xs mt-1 opacity-70">通常在报送后 5-15 分钟内返回。</p>
                    </div>
                )}
            </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
