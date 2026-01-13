
import React, { useState } from 'react';
import { SQLDialect, ToolMode, SQLResult } from './types';
import { processSQL } from './services/geminiService';
import SqlEditor from './components/SqlEditor';
import TechnicalDocs from './components/TechnicalDocs';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [sqlInput, setSqlInput] = useState<string>('');
  const [schemaContext, setSchemaContext] = useState<string>('');
  const [mode, setMode] = useState<ToolMode>(ToolMode.OPTIMIZE);
  // 將預設設為 Oracle (PL/SQL)
  const [sourceDialect, setSourceDialect] = useState<SQLDialect>(SQLDialect.ORACLE);
  const [targetDialect, setTargetDialect] = useState<SQLDialect>(SQLDialect.MYSQL);
  const [result, setResult] = useState<SQLResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3-flash-preview');

  const handleProcess = async () => {
    if (!sqlInput.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await processSQL(sqlInput, mode, sourceDialect, selectedModel, targetDialect, schemaContext);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 font-sans">
      <TechnicalDocs isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
      />
      
      {/* Header */}
      <header className="px-8 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <i className="fa-solid fa-database text-white text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SQL-AI 智庫架構師
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide">企業級 SQL 效能優化與方言轉換工具</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsDocsOpen(true)}
            className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            技術文件
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-sm transition-all border border-slate-700 flex items-center gap-2"
          >
            <i className="fa-solid fa-sliders text-blue-500"></i> 偏好設定
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-full md:w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-2 custom-scrollbar">
          <section className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl">
            <h2 className="text-sm font-semibold mb-4 text-slate-300 flex items-center gap-2">
              <i className="fa-solid fa-terminal text-blue-500"></i> 引擎配置
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2 uppercase font-bold tracking-tighter">執行模式</label>
                <div className="flex bg-slate-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setMode(ToolMode.OPTIMIZE)}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === ToolMode.OPTIMIZE ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    效能優化
                  </button>
                  <button 
                    onClick={() => setMode(ToolMode.CONVERT)}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === ToolMode.CONVERT ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    方言轉換
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2 uppercase font-bold tracking-tighter">來源方言</label>
                <select 
                  value={sourceDialect}
                  onChange={(e) => setSourceDialect(e.target.value as SQLDialect)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.values(SQLDialect).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {mode === ToolMode.CONVERT && (
                <div>
                  <label className="block text-xs text-slate-500 mb-2 uppercase font-bold tracking-tighter">目標方言</label>
                  <select 
                    value={targetDialect}
                    onChange={(e) => setTargetDialect(e.target.value as SQLDialect)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {Object.values(SQLDialect).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              )}
            </div>
          </section>

          <section className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-xl flex-grow flex flex-col min-h-[300px]">
            <h2 className="text-sm font-semibold mb-4 text-slate-300 flex items-center gap-2">
              <i className="fa-solid fa-table text-blue-500"></i> 資料表結構上下文
            </h2>
            <textarea
              value={schemaContext}
              onChange={(e) => setSchemaContext(e.target.value)}
              placeholder="在此貼上 DDL (Create Table) 或 JSON Schema，協助 AI 理解欄位型態與索引..."
              className="flex-grow w-full p-3 bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </section>

          <button
            onClick={handleProcess}
            disabled={isLoading || !sqlInput.trim()}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch animate-spin"></i> 處理中...
              </>
            ) : (
              <>
                <i className={`fa-solid ${mode === ToolMode.OPTIMIZE ? 'fa-bolt-lightning' : 'fa-shuffle'}`}></i> 
                啟動引擎
              </>
            )}
          </button>
        </aside>

        {/* Workspace Area */}
        <div className="flex-grow flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-col">
              <SqlEditor 
                label="輸入原始 SQL" 
                value={sqlInput} 
                onChange={setSqlInput} 
              />
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg flex flex-col relative">
              {isLoading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-400 font-medium">架構師正在分析您的程式碼...</p>
                    <p className="text-slate-500 text-[10px] mt-2 tracking-widest uppercase">Engine: {selectedModel.includes('flash') ? 'Flash' : 'Pro'}</p>
                  </div>
                </div>
              )}
              <SqlEditor 
                label={`${mode === ToolMode.OPTIMIZE ? '優化後' : '轉換後'} 結果`} 
                value={result?.processedSql || ''} 
                onChange={() => {}} 
                readOnly 
              />
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="h-64 bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass-chart text-indigo-500"></i> AI 分析與建議
              </h3>
              {error && <span className="text-xs text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded">偵測到錯誤</span>}
            </div>
            <div className="p-5 overflow-y-auto custom-scrollbar flex-grow">
              {error ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 italic">
                  <i className="fa-solid fa-triangle-exclamation text-3xl mb-3 text-red-500 opacity-50"></i>
                  <p className="text-red-400">{error}</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-blue-400 text-sm font-bold mb-2">設計邏輯說明</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{result.explanation}</p>
                  </div>
                  
                  {mode === ToolMode.OPTIMIZE && result.optimizationTips && result.optimizationTips.length > 0 && (
                    <div>
                      <h4 className="text-green-400 text-sm font-bold mb-2">優化建議事項</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.optimizationTips.map((tip, i) => (
                          <li key={i} className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded flex items-start gap-2">
                            <i className="fa-solid fa-check text-green-500 mt-0.5"></i> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mode === ToolMode.CONVERT && result.conversionNotes && result.conversionNotes.length > 0 && (
                    <div>
                      <h4 className="text-amber-400 text-sm font-bold mb-2">遷移注意事項</h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {result.conversionNotes.map((note, i) => (
                          <li key={i} className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded flex items-start gap-2">
                            <i className="fa-solid fa-circle-info text-amber-500 mt-0.5"></i> {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 italic">
                  <i className="fa-solid fa-wand-magic-sparkles text-3xl mb-3 opacity-20"></i>
                  <p>執行後將在此顯示優化結果與架構分析。</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Status Bar */}
      <footer className="px-8 py-2 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${selectedModel.includes('flash') ? 'bg-amber-500' : 'bg-green-500'}`}></span> 
            {selectedModel.includes('flash') ? 'Flash 極速引擎' : 'Pro 深度推理'}
          </span>
          <span className="flex items-center gap-1"><i className="fa-solid fa-lock"></i> AES-256 加密傳輸</span>
        </div>
        <div>
          SQL-AI Architect Pro © 2025 • 版本 1.1.2-stable
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default App;
