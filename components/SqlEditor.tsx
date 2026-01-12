
import React, { useEffect, useRef } from 'react';

declare const Prism: any;

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  label: string;
  readOnly?: boolean;
}

const SqlEditor: React.FC<SqlEditorProps> = ({ value, onChange, label, readOnly }) => {
  const codeRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [value]);

  // 同步滾動邏輯
  const handleScroll = () => {
    if (textareaRef.current && preRef.current) {
      preRef.current.scrollTop = textareaRef.current.scrollTop;
      preRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // 共享樣式以確保排版一致
  const sharedStyles: React.CSSProperties = {
    margin: 0,
    padding: '1rem',
    border: 'none',
    width: '100%',
    height: '100%',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    tabSize: 4,
    whiteSpace: 'pre', // 改為 pre 以確保橫向滾動與排版嚴格一致
    wordBreak: 'normal',
    overflowWrap: 'normal',
    boxSizing: 'border-box',
    position: 'absolute',
    top: 0,
    left: 0,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        {readOnly && value && (
          <button 
            onClick={() => navigator.clipboard.writeText(value)}
            className="text-[10px] px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
          >
            複製結果
          </button>
        )}
      </div>
      <div className="relative flex-grow bg-slate-800 border border-slate-700 rounded-lg group focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
        {/* 高亮顯示層 (背景) */}
        <pre 
          ref={preRef}
          className="pointer-events-none z-0 m-0"
          style={{ ...sharedStyles, overflow: 'hidden' }}
          aria-hidden="true"
        >
          <code 
            ref={codeRef} 
            className="language-sql inline-block min-w-full"
          >
            {value + (value.endsWith('\n') ? ' ' : '')}
          </code>
        </pre>

        {/* 透明輸入層 (前景) */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          readOnly={readOnly}
          spellCheck={false}
          style={{ 
            ...sharedStyles, 
            color: 'transparent', 
            background: 'transparent',
            caretColor: '#60a5fa', // blue-400
            zIndex: 10,
            overflow: 'auto',
          }}
          className="resize-none outline-none custom-scrollbar"
          placeholder={readOnly ? "等待分析結果..." : "-- 在此輸入您的 SQL 語法..."}
        />
      </div>
    </div>
  );
};

export default SqlEditor;
