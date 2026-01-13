
import React from 'react';
import { TECHNICAL_ROADMAP } from '../constants';

interface TechnicalDocsProps {
  isOpen: boolean;
  onClose: () => void;
}

const TechnicalDocs: React.FC<TechnicalDocsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-book-open text-blue-500 text-xl"></i>
            <h2 className="text-xl font-bold text-white">技術文件與使用指南</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
          
          {/* Section: Schema Context */}
          <section>
            <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-sitemap"></i> 資料表結構上下文 (Schema Context)
            </h3>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              這是 AI 的「導航地圖」。提供 DDL 語法能讓 AI 從單純的語法修補，升級到真正的「架構級優化」。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="text-blue-500 mb-2"><i className="fa-solid fa-microchip"></i></div>
                <h4 className="text-slate-200 text-sm font-bold mb-1">索引精準建議</h4>
                <p className="text-slate-500 text-xs">辨識現有索引，避免重複建立，建議「覆蓋索引」提高查詢效率。</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="text-indigo-500 mb-2"><i className="fa-solid fa-link"></i></div>
                <h4 className="text-slate-200 text-sm font-bold mb-1">優化 Join 邏輯</h4>
                <p className="text-slate-500 text-xs">透過外鍵 (FK) 關係判斷關聯強度，自動調整 Join 順序以降低資料負載。</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="text-teal-500 mb-2"><i className="fa-solid fa-code-compare"></i></div>
                <h4 className="text-slate-200 text-sm font-bold mb-1">精確型態轉換</h4>
                <p className="text-slate-500 text-xs">解決不同資料庫間的資料型態映射問題 (如 VARCHAR 轉 TEXT)。</p>
              </div>
            </div>
          </section>

          {/* Section: Optimization Engine */}
          <section>
            <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-bolt"></i> 極速優化引擎
            </h3>
            <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700/50 border-dashed">
              <p className="text-slate-400 text-sm leading-relaxed">
                本工具搭載 <span className="text-blue-400 font-mono">Gemini 3 Flash</span> 模型，專為高併發與低延遲任務設計。
                我們停用了 Thinking Budget 以確保在秒級時間內回傳結果，同時保持對複雜 SQL 語意的理解力。
              </p>
            </div>
          </section>

          {/* Section: Roadmap */}
          <section>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <i className="fa-solid fa-map-location-dot"></i> 技術發展路線圖
            </h3>
            <div className="relative border-l border-slate-800 ml-4 space-y-8">
              {TECHNICAL_ROADMAP.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${phase.status === 'Done' ? 'bg-green-500' : phase.status === 'In Progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-slate-200 font-bold">{phase.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                      phase.status === 'Done' ? 'bg-green-500/10 text-green-500' : 
                      phase.status === 'In Progress' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Tech Stack */}
          <section className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h4 className="text-slate-400 text-xs font-bold uppercase mb-3">技術棧 (Tech Stack)</h4>
              <div className="flex gap-4 text-slate-500">
                <div className="flex items-center gap-1.5 text-xs"><i className="fa-brands fa-react"></i> React 19</div>
                <div className="flex items-center gap-1.5 text-xs"><i className="fa-solid fa-wind"></i> Tailwind CSS</div>
                <div className="flex items-center gap-1.5 text-xs"><i className="fa-solid fa-brain"></i> Gemini AI</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TechnicalDocs;
