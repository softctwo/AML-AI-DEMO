
import React, { useState } from 'react';
import { RiskRatingModel } from '../types';
import { X, Save, AlertCircle, HelpCircle } from 'lucide-react';

interface RiskModelConfigModalProps {
  model: RiskRatingModel;
  onClose: () => void;
  onSave: (updatedModel: RiskRatingModel) => void;
}

export const RiskModelConfigModal: React.FC<RiskModelConfigModalProps> = ({ model, onClose, onSave }) => {
  const [formData, setFormData] = useState<RiskRatingModel>(JSON.parse(JSON.stringify(model)));

  const handleFactorChange = (index: number, field: 'weight' | 'name', value: any) => {
    const newFactors = [...formData.factors];
    newFactors[index] = { ...newFactors[index], [field]: value };
    setFormData({ ...formData, factors: newFactors });
  };

  const totalWeight = formData.factors.reduce((sum, f) => sum + Number(f.weight), 0);
  const isWeightValid = totalWeight === 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-slate-800">评级模型配置</h2>
            <p className="text-sm text-slate-500">调整 {formData.name} 的评分因子</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
             <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">模型名称</label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
             </div>

             <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800">评分因子权重配置</h4>
                    <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${isWeightValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        总权重: {totalWeight}%
                    </span>
                </div>

                {formData.factors.map((factor, idx) => (
                    <div key={factor.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-slate-700">{factor.name}</span>
                            <span className="text-sm font-mono font-bold text-blue-600">{factor.weight}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5"
                            value={factor.weight}
                            onChange={(e) => handleFactorChange(idx, 'weight', Number(e.target.value))}
                            className="w-full accent-blue-600"
                        />
                        <p className="text-xs text-slate-500 mt-2">{factor.description}</p>
                    </div>
                ))}

                {!isWeightValid && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded text-sm">
                        <AlertCircle size={16} />
                        <span>所有因子权重之和必须等于 100%。请调整。</span>
                    </div>
                )}
             </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg">
            取消
          </button>
          <button 
            onClick={() => onSave(formData)}
            disabled={!isWeightValid}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
          >
            <Save size={18} />
            保存模型
          </button>
        </div>
      </div>
    </div>
  );
};
