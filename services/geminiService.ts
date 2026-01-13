
import { GoogleGenAI, Type } from "@google/genai";
import { SQLDialect, ToolMode, SQLResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const processSQL = async (
  sql: string,
  mode: ToolMode,
  sourceDialect: SQLDialect,
  selectedModel: string, // 新增模型參數
  targetDialect?: SQLDialect,
  schemaContext?: string
): Promise<SQLResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    您是一位世界級的 SQL 架構師與資深 DBA。
    您的任務是優化 SQL 或在不同方言之間進行轉換。
    
    規則：
    1. 保持語意完整性。
    2. 遵循資料庫特定的最佳實踐（例如：使用 CTE、避免 Cursor、正確的索引建議）。
    3. 特別注意 MS Access 的語法限制：日期需使用 # 號包圍，多重 Join 通常需要巢狀括號。
    4. 以結構化 JSON 格式返回響應。
    5. **所有非程式碼的說明文字（explanation, tips, notes）必須使用繁體中文。**
    6. 盡量精簡回答，專注於技術效能。
  `;

  const prompt = mode === ToolMode.OPTIMIZE 
    ? `優化以下 ${sourceDialect} SQL 查詢。
       結構上下文: ${schemaContext || '未提供'}
       SQL: ${sql}`
    : `將以下 SQL 從 ${sourceDialect} 轉換為 ${targetDialect}。
       SQL: ${sql}`;

  try {
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        // 如果選擇的是 flash 模型，則停用 thinking budget 以獲得最高速度
        ...(selectedModel.includes('flash') ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            processedSql: { type: Type.STRING },
            explanation: { type: Type.STRING },
            optimizationTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            conversionNotes: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["processedSql", "explanation"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      originalSql: sql,
      processedSql: data.processedSql,
      explanation: data.explanation,
      optimizationTips: data.optimizationTips || [],
      conversionNotes: data.conversionNotes || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("處理失敗。請確認網路連線或 API Key 權限。");
  }
};
