// Types pour le système RAG Admin Console

export interface EntityType {
  entityType: string;
  titleSingular: string;
  titlePlural: string;
  primaryTable: string;
  primaryKey: string;
  defaultSummaryTemplate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FieldCatalog {
  entityType: string;
  columnName: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'json' | 'vector' | 'enum';
  isFindable: boolean;
  findSynonyms?: string[];
  filterOps?: FilterOperation[];
  isComparable: boolean;
  compareGroup?: string;
  unit?: string;
  normalizer?: string;
  isVerifiable: boolean;
  verifyRuleId?: string;
  isSummarizable: boolean;
  importanceWeight: number; // 0-1
  isRecommendable: boolean;
  recoWeight: number; // 0-1
  vectorSource?: string;
  piiLevel: 'none' | 'basic' | 'sensitive';
  visibilityRole?: string;
  provenanceNote?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FilterOperation = 
  | 'IN' 
  | 'BETWEEN' 
  | 'RANGE' 
  | 'LIKE' 
  | 'ILIKE' 
  | 'GT' 
  | 'GTE' 
  | 'LT' 
  | 'LTE' 
  | 'EQ' 
  | 'NEQ';

export interface Rule {
  ruleId: string;
  entityType: string;
  ruleType: 'compatibility' | 'constraint' | 'business';
  dslSql: string;
  explanationTemplate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Relation {
  entityTypeFrom: string;
  entityTypeTo: string;
  relation: 'compatible_with' | 'similar_to' | 'belongs_to' | 'has_many' | 'many_to_many';
  joinSql: string;
  isVerifiable: boolean;
  isRecommendable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmbeddingSpec {
  embeddingSpec: string;
  entityType: string;
  columnName: string;
  dimensions: number;
  refreshJob?: string;
  implicitSignal?: string;
  halfLifeDays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Facet {
  facetId: string;
  name: string;
  entityType: string;
  columnName: string;
  filterOps: FilterOperation[];
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComparisonMetric {
  metricId: string;
  name: string;
  entityType: string;
  columnName: string;
  unit: string;
  normalizer?: string;
  direction: 'asc' | 'desc'; // asc = plus c'est mieux, desc = moins c'est mieux
  weight: number; // 0-1
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendationConfig {
  configId: string;
  name: string;
  entityType: string;
  signals: string[];
  engine: 'content_based' | 'collaborative' | 'hybrid';
  topN: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Permission {
  permissionId: string;
  entityType: string;
  columnName?: string;
  role: string;
  intent: 'findable' | 'comparable' | 'verifiable' | 'summarizable' | 'recommendable';
  allowed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IntentCoverage {
  entityType: string;
  findable: number; // pourcentage de champs trouvables
  comparable: number;
  verifiable: number;
  summarizable: number;
  recommendable: number;
  totalFields: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  coverage: IntentCoverage[];
}

export interface ExportManifest {
  version: string;
  entities: EntityType[];
  fields: FieldCatalog[];
  rules: Rule[];
  relations: Relation[];
  facets: Facet[];
  comparisonMetrics: ComparisonMetric[];
  recommendationConfigs: RecommendationConfig[];
  permissions: Permission[];
  exportedAt: string;
}
