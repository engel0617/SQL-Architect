
import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, selectedModel, onModelChange }) => {
  if (!isOpen) return null;

  const models = [
    {
      id: 'gemini-3-flash-preview',
      name: 'Gemini 3 Flash',
      desc: '極速響應，適用於一般優化與轉換任務。',
      icon: 'fa-bolt-lightning',
      color: 'text-amber-400'
    },
    {
      id: 'gemini-3-pro-preview',
      name: 'Gemini 3 Pro',
      desc: '深度推理，適用於複雜架構分析與超長 SQL。',
      icon: 'fa-brain',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-gear text-slate-400"></i> 偏好設定
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI 模型引擎</label>
          <div className="grid gap-3">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => onModelChange(m.id)}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedModel === m.id 
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500' 
                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className={`mt-1 ${m.color}`}>
                  <i className={`fa-solid ${m.icon} text-lg`}></i>
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{m.name}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-800/50 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            儲存並關閉
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
