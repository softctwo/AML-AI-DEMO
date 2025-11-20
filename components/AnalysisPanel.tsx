
import React, { useEffect, useState } from 'react';
import { X, Bot, CheckCircle, XCircle, Send, FileJson, Loader2, ThumbsUp, ThumbsDown, MessageSquare, ArrowRight, User, Building2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Transaction, ReportStatus, AiFeedback, Customer } from '../types';
import { analyzeTransaction, generateReportXml } from '../services/geminiService';

interface AnalysisPanelProps {
  transaction: Transaction | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ReportStatus, feedback?: string) => void;
  onFeedback: (id: string, feedback: AiFeedback) => void;
}

// 子组件：展示客户详情卡片
const CustomerDetailCard = ({ role, customer }: { role: string, customer: Customer }) => {
    const isHigh = customer.riskRating.includes('高');
    const isMedium = customer.riskRating.includes('中');
    
    const borderColor = isHigh ? 'border-red-200' : isMedium ? 'border-amber-200' : 'border-slate-200';
    const bgColor = isHigh ? 'bg-red-50' : isMedium ? 'bg-amber-50' : 'bg-white';
    const badgeClass = isHigh ? 'bg-red-100 text-red-700' : isMedium ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700';

    return (
        <div className={`flex-1 p-3 rounded-lg border ${borderColor} ${bgColor} relative`}>
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{role}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${badgeClass}`}>
                    {customer.riskRating}
                </span>
            </div>
            <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${isHigh ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                    {customer.type === '企业' ? <Building2 size={16} /> : <User size={16} />}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-slate-800 leading-tight mb-0.5">{customer.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{customer.country} · {customer.id}</p>
                    
                    <div className="space-y-1">
                         <div className="flex gap-2 text-xs">
                            <span className="text-slate-400 shrink-0">证件:</span>
                            <span className="text-slate-600 font-mono truncate max-w-[100px]" title={customer.idNumber}>{customer.idNumber}</span>
                         </div>
                         {customer.industry && (
                            <div className="flex gap-2 text-xs">
                                <span className="text-slate-400 shrink-0">行业:</span>
                                <span className="text-slate-600 truncate max-w-[100px]" title={customer.industry}>{customer.industry}</span>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ transaction, onClose, onUpdateStatus, onFeedback }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [reportPreview, setReportPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState<'positive' | 'negative' | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (transaction) {
      // Initialize or reset analysis state
      if (transaction.status === ReportStatus.PENDING_REVIEW) {
        setAnalysis('');
        setReportPreview(null);
        runAnalysis(transaction);
      } else {
        setAnalysis(transaction.aiAnalysis || "本次会话暂无历史分析记录。");
      }

      // Initialize feedback state
      if (transaction.aiFeedback) {
        setFeedbackRating(transaction.aiFeedback.rating);
        setFeedbackComment(transaction.aiFeedback.comment);
        setFeedbackSubmitted(true);
      } else {
        setFeedbackRating(null);
        setFeedbackComment('');
        setFeedbackSubmitted(false);
      }
    }
  }, [transaction]);

  const runAnalysis = async (tx: Transaction) => {
    setLoading(true);
    onUpdateStatus(tx.id, ReportStatus.ANALYZING);
    const result = await analyzeTransaction(tx);
    setAnalysis(result);
    setLoading(false);
    onUpdateStatus(tx.id, ReportStatus.ANALYZED); // Mark local state as analyzed
  };

  const handleDismiss = () => {
    if (!transaction) return;
    onUpdateStatus(transaction.id, ReportStatus.DISMISSED);
    onClose();
  };

  const handlePrepareReport = () => {
    if (!transaction) return;
    const xml = generateReportXml(transaction, analysis);
    setReportPreview(xml);
  };

  const handleSubmitReport = () => {
    if (!transaction) return;
    setSubmitting(true);
    
    // Simulate API call to Central Bank/AML Center
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1; // 90% success rate
      setSubmitting(false);
      
      if (isSuccess) {
        onUpdateStatus(transaction.id, ReportStatus.SUBMITTED);
        // In a real app, we would wait for async feedback. Here we simulate immediate feedback receipt after submission logic
        setTimeout(() => {
            onUpdateStatus(transaction.id, ReportStatus.ACCEPTED, "反洗钱监测中心反馈: 报文已接收。 批次号: 998877。");
        }, 2000);
      } else {
        onUpdateStatus(transaction.id, ReportStatus.REJECTED, "错误: XML Schema 结构校验失败。");
      }
      onClose();
    }, 1500);
  };

  const handleSubmitFeedback = () => {
    if (!transaction || !feedbackRating) return;
    
    const feedbackData: AiFeedback = {
      rating: feedbackRating,
      comment: feedbackComment,
      timestamp: new Date().toISOString()
    };

    onFeedback(transaction.id, feedbackData);
    setFeedbackSubmitted(true);
  };

  if (!transaction) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[650px] bg-white shadow-2xl border-l border-slate-200 transform transition-transform duration-300 ease-in-out z-50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold">
            <Sparkles size={18} />
            <span>AI 智能合规分析</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mt-1">交易甄别与研判</h2>
          <p className="text-sm text-slate-500">流水号: {transaction.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Transaction Details Section */}
        <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
               基础交易画像
            </h3>
            
            {/* Basic Info Strip */}
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-slate-500 mb-1">交易金额</p>
                        <p className="text-xl font-bold text-slate-800 font-mono">
                            {transaction.amount.toLocaleString()} <span className="text-sm text-slate-500">{transaction.currency}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 mb-1">触发规则</p>
                        <p className="text-xs font-medium text-amber-700 px-2 py-1 bg-amber-50 rounded border border-amber-100 inline-block max-w-[220px] truncate" title={transaction.triggerRule}>
                            {transaction.triggerRule}
                        </p>
                    </div>
                </div>

                {/* Enhanced Details Row */}
                <div className="pt-3 border-t border-slate-200 flex gap-4">
                    <div className="flex-1">
                         <p className="text-xs text-slate-500 mb-1">交易附言</p>
                         <p className="text-sm font-medium text-slate-700">{transaction.summary || 'N/A'}</p>
                    </div>
                    <div className="flex-1">
                         <p className="text-xs text-slate-500 mb-1">交易时间</p>
                         <p className="text-sm font-mono text-slate-700">{transaction.date}</p>
                    </div>
                </div>
            </div>

            {/* Participants Flow */}
            <div className="flex items-stretch gap-2">
                <CustomerDetailCard role="发送方 (汇款)" customer={transaction.sender} />
                <div className="flex items-center justify-center text-slate-300 px-1">
                    <ArrowRight size={20} />
                </div>
                <CustomerDetailCard role="接收方 (收款)" customer={transaction.recipient} />
            </div>
        </div>

        {/* AI Analysis Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Bot size={18} className="text-indigo-600" />
            AI 智能分析报告
            {loading && <Loader2 className="animate-spin text-blue-500 w-4 h-4" />}
          </h3>
          
          {loading ? (
            <div className="space-y-3 animate-pulse p-4 border border-slate-100 rounded-lg">
              <div className="h-4 bg-slate-100 rounded w-1/3"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-2/3"></div>
            </div>
          ) : (
            <>
              <div className="prose prose-sm prose-indigo max-w-none bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
              
              {/* Feedback Section */}
              {analysis && !loading && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <MessageSquare size={14} />
                    AI 研判准确性反馈
                  </h4>
                  
                  {feedbackSubmitted ? (
                    <div className="text-green-600 text-sm flex items-center gap-2 bg-green-50 p-2 rounded border border-green-100">
                      <CheckCircle size={16} />
                      感谢您的专业反馈，这将用于微调本地反洗钱模型。
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setFeedbackRating('positive')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                            feedbackRating === 'positive' 
                              ? 'bg-blue-100 text-blue-700 border-blue-300' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp size={14} /> 准确/有帮助
                        </button>
                        <button 
                          onClick={() => setFeedbackRating('negative')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                            feedbackRating === 'negative' 
                              ? 'bg-red-100 text-red-700 border-red-300' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsDown size={14} /> 误报/遗漏风险
                        </button>
                      </div>
                      
                      <textarea
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="请输入具体的修订意见，例如：忽略了同名账户关联..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        rows={2}
                      />
                      
                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmitFeedback}
                          disabled={!feedbackRating}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          提交模型反馈
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Report Preview */}
        {reportPreview && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
             <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileJson size={16} /> 拟报送报文预览 (XML)
             </h3>
             <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono border border-slate-700">
                {reportPreview}
             </pre>
          </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-4">
        {!reportPreview ? (
          <div className="flex gap-3">
             <button 
              onClick={handleDismiss}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle size={18} />
              排除风险 (Dismiss)
            </button>
            <button 
              onClick={handlePrepareReport}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle size={18} />
              生成可疑报告 (STR)
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setReportPreview(null)}
              className="px-4 py-3 text-slate-500 font-medium hover:text-slate-800"
            >
              返回修改
            </button>
            <button 
              onClick={handleSubmitReport}
              disabled={submitting}
              className="flex-1 py-3 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
              {submitting ? "报送中..." : "报送至反洗钱中心"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
