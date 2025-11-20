
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';

export const CopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: 'init', role: 'assistant', content: '您好！我是您的 AI 合规助手。您可以问我关于反洗钱法规、可疑交易特征或请求生成文案模版。', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_KEY = process.env.API_KEY || '';
  const aiClient = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
      if (!input.trim() || isLoading) return;

      const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: input,
          timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
          if (!aiClient) throw new Error("API Key missing");

          // System Prompt for AML Expert Context
          const systemInstruction = `
            你是一个专业的银行反洗钱(AML)合规助手。你的职责是协助合规分析员进行工作。
            你的能力包括：
            1. 解读中国人民银行(PBOC)的反洗钱法规（如3号令、19号令、164号文、235号文、300号文等）。
            2. 解释反洗钱监测标准（如FATF建议）。
            3. 起草尽职调查(CDD)问询邮件或报告摘要。
            4. 解释常见的洗钱类型（如地下钱庄、恐怖融资、赌博跑分等）。
            
            请保持回答专业、简洁、严谨。如果是生成文案，请使用标准的商务/法律口吻。
          `;

          const chat = aiClient.chats.create({
              model: 'gemini-2.5-flash',
              config: { systemInstruction }
          });

          const result = await chat.sendMessage({ message: userMsg.content });
          const responseText = result.text;

          const aiMsg: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: responseText || "抱歉，我无法生成回答。",
              timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMsg]);

      } catch (error) {
          console.error(error);
          setMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: "连接 AI 服务失败，请检查 API Key 配置。",
              timestamp: new Date()
          }]);
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <>
        {/* Floating Button */}
        <button 
            onClick={() => setIsOpen(true)}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-100 opacity-100'}`}
        >
            <Bot size={28} />
        </button>

        {/* Chat Window */}
        <div className={`fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AML Copilot</h3>
                        <p className="text-[10px] opacity-80">AI 智能合规助手 (Beta)</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors">
                    <X size={18} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                        }`}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                            <p className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                            <Loader2 size={14} className="animate-spin text-blue-500" />
                            思考中...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="询问法规、风险特征或请求协助..."
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button onClick={() => setInput("如何识别地下钱庄交易特征？")} className="text-[10px] whitespace-nowrap bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">地下钱庄特征</button>
                    <button onClick={() => setInput("帮我起草一份针对大额现金存取的尽调问询函")} className="text-[10px] whitespace-nowrap bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">起草尽调函</button>
                    <button onClick={() => setInput("简述235号文的核心要求")} className="text-[10px] whitespace-nowrap bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 transition-colors">235号文解读</button>
                </div>
            </div>
        </div>
    </>
  );
};
