// Types pour les réponses API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EntityTypeResponse {
  entityType: string;
  titleSingular: string;
  titlePlural: string;
  primaryTable: string;
  primaryKey: string;
  defaultSummaryTemplate: string;
  fieldCount: number;
  coverage: {
    findable: number;
    comparable: number;
    verifiable: number;
    summarizable: number;
    recommendable: number;
  };
}

export interface FieldCatalogResponse {
  entityType: string;
  columnName: string;
  dataType: string;
  isFindable: boolean;
  isComparable: boolean;
  isVerifiable: boolean;
  isSummarizable: boolean;
  isRecommendable: boolean;
  piiLevel: string;
  importanceWeight: number;
  recoWeight: number;
}

export interface RuleTestResult {
  passed: boolean;
  message: string;
  executionTime: number;
  variables?: Record<string, any>;
}

export interface RecommendationTestResult {
  entityId: string;
  score: number;
  rationale: string;
  signals: Record<string, number>;
}

export interface ValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  coverage: Array<{
    entityType: string;
    findable: number;
    comparable: number;
    verifiable: number;
    summarizable: number;
    recommendable: number;
    totalFields: number;
  }>;
}
