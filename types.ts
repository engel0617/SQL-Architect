
export enum SQLDialect {
  POSTGRESQL = 'PostgreSQL',
  MYSQL = 'MySQL',
  ORACLE = 'Oracle (PL/SQL)',
  SQLSERVER = 'SQL Server (T-SQL)',
  SQLITE = 'SQLite',
  MSACCESS = 'MS Access'
}

export enum ToolMode {
  OPTIMIZE = 'Optimize',
  CONVERT = 'Convert'
}

export interface SQLResult {
  originalSql: string;
  processedSql: string;
  explanation: string;
  optimizationTips?: string[];
  conversionNotes?: string[];
  executionPlanGuess?: string;
}
