
import { GoogleGenAI, Type } from "@google/genai";
import { SQLDialect, ToolMode, SQLResult } from "../types";

export const processSQL = async (
  sql: string,
  mode: ToolMode,
  sourceDialect: SQLDialect,
  selectedModel: string,
  targetDialect?: SQLDialect,
  schemaContext?: string,
  customApiKey?: string // 新增自定義 Key 參數
): Promise<SQLResult> => {
  // 優先權：使用者輸入的 Key > 環境變數中的 Key
  const activeKey = customApiKey || process.env.API_KEY || "";
  
  if (!activeKey) {
    throw new Error("找不到 API Key。請在偏好設定中輸入您的 Google AI API Key。");
  }

  const ai = new GoogleGenAI({ apiKey: activeKey });
  
  const systemInstruction = `
    您是一位世界級的 SQL 架構師與資深 DBA。
    您的任務是優化 SQL 或在不同方言之間進行轉換。
    
    規則：
    1. 保持語意完整性。遵循資料庫最佳實踐。
    2. 以結構化 JSON 格式返回響應。
    3. 所有說明文字必須使用繁體中文。
    4. 若為 MS Access，注意日期 # 號與 Join 括號限制。
  `;

  const prompt = mode === ToolMode.OPTIMIZE 
    ? `優化以下 ${sourceDialect} SQL 查詢。結構上下文: ${schemaContext || '未提供'}。SQL: ${sql}`
    : `將以下 SQL 從 ${sourceDialect} 轉換為 ${targetDialect}。SQL: ${sql}`;

  try {
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        ...(selectedModel.includes('flash') ? { thinkingConfig: { thinkingBudget: 0 } } : {}),
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            processedSql: { type: Type.STRING },
            explanation: { type: Type.STRING },
            optimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            conversionNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["processedSql", "explanation"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // 拋出更具體的錯誤訊息
    const msg = error.message || "";
    if (msg.includes("403")) throw new Error("API Key 權限不足或無效 (403)。請檢查是否啟用了 Gemini 3 權限。");
    if (msg.includes("429")) throw new Error("觸發頻率限制 (429)。請稍後再試。");
    if (msg.includes("API_KEY_INVALID")) throw new Error("無效的 API Key。請重新檢查輸入。");
    throw new Error(`處理失敗: ${msg || "請確認網路連線"}`);
  }
};
