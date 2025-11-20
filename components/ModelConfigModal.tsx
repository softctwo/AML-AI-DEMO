


import React, { useState } from 'react';
import { MonitoringModel, ModelTechType } from '../types';
import { X, Save, AlertCircle, Sliders, Activity, Play, RotateCcw, Trash2, Plus, BrainCircuit, Network, Binary } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ModelConfigModalProps {
  model: MonitoringModel | null; // Null for new model
  onClose: () => void;
  onSave: (updatedModel: MonitoringModel) => void;
}

export const ModelConfigModal: React.FC<ModelConfigModalProps> = ({ model, onClose, onSave }) => {
  // Default template for new model
  const defaultModel: MonitoringModel = {
    id: `MDL-NEW-${Date.now()}`,
    name: '新建监测模型',
    type: '可疑',
    techType: '规则',
    description: '',
    threshold: 0,
    thresholdCurrency: 'CNY',
    riskScoreWeight: 50,
    isEnabled: false,
    parameters: {},
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<MonitoringModel>(model ? { ...model } : defaultModel);
  const [activeTab, setActiveTab] = useState<'basic' | 'params' | 'test'>('basic');
  const [isDirty, setIsDirty] = useState(false);
  
  const isNew = !model;

  // State for new parameter
  const [isAddingParam, setIsAddingParam] = useState(false);
  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');

  const handleBasicChange = (field: keyof MonitoringModel, value: any) => {
    setFormData({ ...formData, [field]: value });
    setIsDirty(true);
  };

  const handleTechTypeChange = (type: ModelTechType) => {
      setFormData({ 
          ...formData, 
          techType: type,
          // Reset relevant params based on type for UX
          thresholdCurrency: type === '规则' ? 'CNY' : type === '机器学习' ? 'SCORE' : 'NA'
      });
      setIsDirty(true);
  };

  const handleParamChange = (key: string, value: string | number) => {
    setFormData({
      ...formData,
      parameters: {
        ...formData.parameters,
        [key]: value
      }
    });
    setIsDirty(true);
  };

  const handleAddParam = () => {
    if (newParamKey && newParamValue) {
      setFormData({
        ...formData,
        parameters: {
          ...formData.parameters,
          [newParamKey]: newParamValue
        }
      });
      setNewParamKey('');
      setNewParamValue('');
      setIsAddingParam(false);
      setIsDirty(true);
    }
  };

  const handleRemoveParam = (key: string) => {
    const newParams = { ...formData.parameters };
    delete newParams[key];
    setFormData({
      ...formData,
      parameters: newParams
    });
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const safeBtoa = (str: string) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      return str;
    }
  };

  const testData = [
    { time: '09:00', actual: 12, simulated: 10 },
    { time: '10:00', actual: 18, simulated: 15 },
    { time: '11:00', actual: 8, simulated: 22 },
    { time: '12:00', actual: 25, simulated: 28 },
    { time: '13:00', actual: 20, simulated: 20 },
    { time: '14:00', actual: 35, simulated: 32 },
    { time: '15:00', actual: 40, simulated: 45 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <div className="flex items-center gap-3">
                {isNew ? (
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleBasicChange('name', e.target.value)}
                        className="text-xl font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none"
                        placeholder="输入模型名称"
                    />
                ) : (
                    <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
                )}
                {!isNew && <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 border border-slate-200 rounded">{formData.id}</span>}
            </div>
            <p className="text-sm text-slate-500 mt-1">{isNew ? '创建新的监测模型' : `${formData.techType} 模型配置`}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
            <button 
                onClick={() => setActiveTab('basic')} 
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <div className="flex items-center gap-2"><Sliders size={16} /> 核心配置</div>
            </button>
            <button 
                onClick={() => setActiveTab('params')} 
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'params' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <div className="flex items-center gap-2"><Activity size={16} /> 高级参数</div>
            </button>
            <button 
                onClick={() => setActiveTab('test')} 
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'test' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
                <div className="flex items-center gap-2"><Play size={16} /> 模拟回测</div>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            
            {/* Basic Config Tab */}
            {activeTab === 'basic' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Technology Selection */}
                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                        <label className="block text-sm font-medium text-slate-700 mb-3">技术路线 (Technology Stack)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => handleTechTypeChange('规则')}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.techType === '规则' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Binary size={24} />
                                <span className="text-sm font-medium">规则引擎</span>
                            </button>
                            <button
                                onClick={() => handleTechTypeChange('机器学习')}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.techType === '机器学习' ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <BrainCircuit size={24} />
                                <span className="text-sm font-medium">机器学习 (ML)</span>
                            </button>
                            <button
                                onClick={() => handleTechTypeChange('图谱')}
                                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${formData.techType === '图谱' ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Network size={24} />
                                <span className="text-sm font-medium">图谱分析</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                        {/* Conditional Logic based on Tech Type */}
                        {formData.techType === '规则' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">触发阈值 ({formData.thresholdCurrency})</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={formData.threshold}
                                        onChange={(e) => handleBasicChange('threshold', Number(e.target.value))}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                    />
                                    <select 
                                        value={formData.thresholdCurrency}
                                        onChange={(e) => handleBasicChange('thresholdCurrency', e.target.value)}
                                        className="px-3 py-2 border border-slate-300 rounded-md outline-none text-sm bg-slate-50"
                                    >
                                        <option value="CNY">CNY</option>
                                        <option value="USD">USD</option>
                                        <option value="COUNT">次数</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {formData.techType === '机器学习' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">算法模型</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                        value={formData.parameters['算法'] || ''}
                                        onChange={(e) => handleParamChange('算法', e.target.value)}
                                    >
                                        <option value="">请选择...</option>
                                        <option value="XGBoost v1.7">XGBoost v1.7 (Gradient Boosting)</option>
                                        <option value="Random Forest">Random Forest (随机森林)</option>
                                        <option value="Isolation Forest">Isolation Forest (异常检测)</option>
                                        <option value="Neural Network">Deep Neural Network (深度学习)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">判别阈值 (Probability Score &gt; X)</label>
                                    <div className="flex items-center gap-4">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            value={formData.threshold}
                                            onChange={(e) => handleBasicChange('threshold', Number(e.target.value))}
                                            className="flex-1 accent-purple-600"
                                        />
                                        <span className="font-mono font-bold text-slate-700 w-10">{formData.threshold}%</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {formData.techType === '图谱' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">图计算算法</label>
                                    <select 
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        value={formData.parameters['图算法'] || ''}
                                        onChange={(e) => handleParamChange('图算法', e.target.value)}
                                    >
                                        <option value="">请选择...</option>
                                        <option value="Louvain Community Detection">Louvain (社区发现)</option>
                                        <option value="PageRank">PageRank (节点重要性)</option>
                                        <option value="Connected Components">Connected Components (连通分量)</option>
                                        <option value="Cycle Detection">Cycle Detection (环路检测)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">最大遍历深度 (Hops)</label>
                                    <input 
                                        type="number" 
                                        value={formData.parameters['最大跳数'] || 3}
                                        onChange={(e) => handleParamChange('最大跳数', Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-orange-500 outline-none font-mono"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                风险分值权重 (0-100)
                                <span className="ml-2 text-xs font-normal text-slate-400">决定该模型触发后对客户整体风险等级的影响程度</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={formData.riskScoreWeight}
                                    onChange={(e) => handleBasicChange('riskScoreWeight', Number(e.target.value))}
                                    className="flex-1 accent-slate-600"
                                />
                                <span className="font-mono font-bold text-slate-700 w-10">{formData.riskScoreWeight}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">模型描述说明</label>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium ${formData.isEnabled ? 'text-green-600' : 'text-slate-500'}`}>
                                    {formData.isEnabled ? '已启用' : '已停用'}
                                </span>
                                <button 
                                    onClick={() => handleBasicChange('isEnabled', !formData.isEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => handleBasicChange('description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="请输入该模型的业务背景、监测逻辑概述..."
                        />
                    </div>
                </div>
            )}

            {/* Parameters Tab (Standard Key-Value) */}
            {activeTab === 'params' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        {Object.entries(formData.parameters).length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-sm">暂无自定义参数</div>
                        )}
                        {Object.entries(formData.parameters).map(([key, value], index) => (
                            <div key={key} className={`p-5 flex items-center justify-between ${index !== 0 ? 'border-t border-slate-100' : ''} hover:bg-slate-50 transition-colors group`}>
                                <div className="w-1/2 pr-4">
                                    <label className="font-medium text-slate-700 block mb-1">{key}</label>
                                    <p className="text-xs text-slate-400">KEY: {safeBtoa(key).substring(0, 8)}...</p>
                                </div>
                                <div className="w-1/2 flex items-center gap-3">
                                    <input 
                                        type="text" 
                                        value={value}
                                        onChange={(e) => handleParamChange(key, e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                    />
                                    <button 
                                        onClick={() => handleRemoveParam(key)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="删除参数"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {isAddingParam && (
                            <div className="p-5 border-t border-slate-100 bg-blue-50/30 animate-in slide-in-from-top-2">
                                <div className="flex gap-3 mb-3">
                                    <div className="w-1/2">
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">参数名称</label>
                                        <input 
                                            type="text" 
                                            value={newParamKey}
                                            onChange={(e) => setNewParamKey(e.target.value)}
                                            placeholder="例如: 时间窗口"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label className="text-xs font-bold text-slate-500 mb-1 block">参数值</label>
                                        <input 
                                            type="text" 
                                            value={newParamValue}
                                            onChange={(e) => setNewParamValue(e.target.value)}
                                            placeholder="例如: 30天"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => setIsAddingParam(false)}
                                        className="px-3 py-1.5 text-slate-500 text-sm hover:bg-slate-200 rounded"
                                    >
                                        取消
                                    </button>
                                    <button 
                                        onClick={handleAddParam}
                                        disabled={!newParamKey || !newParamValue}
                                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        确认添加
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {!isAddingParam && (
                        <button 
                            onClick={() => setIsAddingParam(true)}
                            className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> 添加自定义参数
                        </button>
                    )}
                </div>
            )}

            {/* Test Tab (Same as before) */}
            {activeTab === 'test' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                     <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-slate-800">历史数据回测</h4>
                            <p className="text-sm text-slate-500">基于过去7天的数据，对比当前参数与修改后参数的预警量差异。</p>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded hover:bg-slate-700">
                            <RotateCcw size={14} /> 运行回测
                        </button>
                     </div>
                     <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={testData}>
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorSim" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" name="基准" />
                                <Area type="monotone" dataKey="simulated" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSim)" name="模拟" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={!isDirty && !isNew}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Save size={18} />
            {isNew ? '创建模型' : '保存配置'}
          </button>
        </div>

      </div>
    </div>
  );
};