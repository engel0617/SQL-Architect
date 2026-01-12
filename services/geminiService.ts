
import { GoogleGenAI, Type } from "@google/genai";
import { SQLDialect, ToolMode, SQLResult } from "../types";

const API_KEY = process.env.API_KEY || "";

export const processSQL = async (
  sql: string,
  mode: ToolMode,
  sourceDialect: SQLDialect,
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
    3. 特別注意 MS Access 的語法限制：日期需使用 # 號包圍，多重 Join 通常需要巢狀括號，且不支援某些標準 SQL 函數。
    4. 以結構化 JSON 格式返回響應。
    5. 優化模式：專注於降低複雜度、提高 Join 效率並建議索引。
    6. 轉換模式：處理函數映射（例如 ISNULL vs COALESCE）、資料型態和特定語法（例如 TOP vs LIMIT）。
    7. **所有非程式碼的說明文字（explanation, tips, notes）必須使用繁體中文。**
  `;

  const prompt = mode === ToolMode.OPTIMIZE 
    ? `優化以下 ${sourceDialect} SQL 查詢。
       結構上下文: ${schemaContext || '未提供'}
       SQL: ${sql}`
    : `將以下 SQL 從 ${sourceDialect} 轉換為 ${targetDialect}。
       確保處理日期函數、字串連接和分頁語法。
       SQL: ${sql}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
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
    throw new Error("Failed to process SQL. Please check your prompt and try again.");
  }
};
