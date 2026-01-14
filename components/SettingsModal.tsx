
import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedModel, 
  onModelChange,
  apiKey,
  onApiKeyChange
}) => {
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const models = [
    {
      id: 'gemini-3-flash-preview',
      name: 'Gemini 3 Flash',
      desc: '極速引擎，適合 90% 的日常優化任務。',
      icon: 'fa-bolt-lightning',
      color: 'text-amber-400'
    },
    {
      id: 'gemini-3-pro-preview',
      name: 'Gemini 3 Pro',
      desc: '最強推理，適合複雜跨庫遷移與超長語法。',
      icon: 'fa-brain',
      color: 'text-blue-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
          <h2 className="font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-sliders text-blue-500"></i> 進階偏好設定
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
          {/* Section: API Key */}
          <section className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Google AI API Key</label>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[10px] text-blue-400 hover:underline">獲取 API Key <i className="fa-solid fa-arrow-up-right-from-square ml-1"></i></a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder="在此貼上您的 API Key..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-12 font-mono"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <i className={`fa-solid ${showKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic">Key 將僅存儲於您的瀏覽器 LocalStorage，不會上傳至第三方伺服器。</p>
          </section>

          {/* Section: Models */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">AI 模型引擎</label>
            <div className="grid gap-3">
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onModelChange(m.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left group ${
                    selectedModel === m.id 
                      ? 'bg-blue-600/10 border-blue-500 ring-1 ring-blue-500' 
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className={`mt-1 ${m.color} group-hover:scale-110 transition-transform`}>
                    <i className={`fa-solid ${m.icon} text-lg`}></i>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{m.name}</div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{m.desc}</div>
                  </div>
                </button>
              ))}
              
              {/* Future Local Model placeholder */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed">
                <div className="mt-1 text-slate-600">
                  <i className="fa-solid fa-server text-lg"></i>
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-500">本地模型 (Ollama / Local)</div>
                  <div className="text-xs text-slate-600 mt-1">即將推出。需自行搭建本地推理伺服器以達 100% 離線。</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="px-6 py-5 bg-slate-800/50 border-t border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40 active:scale-95"
          >
            儲存配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
