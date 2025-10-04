-- Création du schéma RAG Admin
CREATE SCHEMA IF NOT EXISTS rag_admin;

-- Table entity_type
CREATE TABLE rag_admin.entity_type (
    entity_type VARCHAR(100) PRIMARY KEY,
    title_singular VARCHAR(200) NOT NULL,
    title_plural VARCHAR(200) NOT NULL,
    primary_table VARCHAR(200) NOT NULL,
    primary_key VARCHAR(100) NOT NULL,
    default_summary_template TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table field_catalog
CREATE TABLE rag_admin.field_catalog (
    id SERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    column_name VARCHAR(200) NOT NULL,
    data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('string', 'number', 'boolean', 'date', 'json', 'vector', 'enum')),
    is_findable BOOLEAN DEFAULT FALSE,
    find_synonyms JSONB DEFAULT '[]',
    filter_ops JSONB DEFAULT '[]',
    is_comparable BOOLEAN DEFAULT FALSE,
    compare_group VARCHAR(100),
    unit VARCHAR(50),
    normalizer VARCHAR(200),
    is_verifiable BOOLEAN DEFAULT FALSE,
    verify_rule_id VARCHAR(100),
    is_summarizable BOOLEAN DEFAULT FALSE,
    importance_weight DECIMAL(3,2) DEFAULT 0.5 CHECK (importance_weight >= 0 AND importance_weight <= 1),
    is_recommendable BOOLEAN DEFAULT FALSE,
    reco_weight DECIMAL(3,2) DEFAULT 0.5 CHECK (reco_weight >= 0 AND reco_weight <= 1),
    vector_source VARCHAR(200),
    pii_level VARCHAR(20) DEFAULT 'none' CHECK (pii_level IN ('none', 'basic', 'sensitive')),
    visibility_role VARCHAR(100),
    provenance_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_type, column_name)
);

-- Table rules
CREATE TABLE rag_admin.rules (
    rule_id VARCHAR(100) PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    rule_type VARCHAR(20) NOT NULL CHECK (rule_type IN ('compatibility', 'constraint', 'business')),
    dsl_sql TEXT NOT NULL,
    explanation_template TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table relations
CREATE TABLE rag_admin.relations (
    id SERIAL PRIMARY KEY,
    entity_type_from VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    entity_type_to VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    relation VARCHAR(50) NOT NULL CHECK (relation IN ('compatible_with', 'similar_to', 'belongs_to', 'has_many', 'many_to_many')),
    join_sql TEXT NOT NULL,
    is_verifiable BOOLEAN DEFAULT FALSE,
    is_recommendable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table embedding_specs
CREATE TABLE rag_admin.embedding_specs (
    embedding_spec VARCHAR(100) PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    column_name VARCHAR(200) NOT NULL,
    dimensions INTEGER NOT NULL,
    refresh_job VARCHAR(200),
    implicit_signal VARCHAR(100),
    half_life_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table facets
CREATE TABLE rag_admin.facets (
    facet_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    column_name VARCHAR(200) NOT NULL,
    filter_ops JSONB NOT NULL DEFAULT '[]',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table comparison_metrics
CREATE TABLE rag_admin.comparison_metrics (
    metric_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    column_name VARCHAR(200) NOT NULL,
    unit VARCHAR(50),
    normalizer VARCHAR(200),
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('asc', 'desc')),
    weight DECIMAL(3,2) DEFAULT 0.5 CHECK (weight >= 0 AND weight <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table recommendation_configs
CREATE TABLE rag_admin.recommendation_configs (
    config_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    signals JSONB NOT NULL DEFAULT '[]',
    engine VARCHAR(20) NOT NULL CHECK (engine IN ('content_based', 'collaborative', 'hybrid')),
    top_n INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table permissions
CREATE TABLE rag_admin.permissions (
    permission_id VARCHAR(100) PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL REFERENCES rag_admin.entity_type(entity_type) ON DELETE CASCADE,
    column_name VARCHAR(200),
    role VARCHAR(100) NOT NULL,
    intent VARCHAR(20) NOT NULL CHECK (intent IN ('findable', 'comparable', 'verifiable', 'summarizable', 'recommendable')),
    allowed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes pour améliorer les performances
CREATE INDEX idx_field_catalog_entity_type ON rag_admin.field_catalog(entity_type);
CREATE INDEX idx_field_catalog_findable ON rag_admin.field_catalog(is_findable) WHERE is_findable = TRUE;
CREATE INDEX idx_field_catalog_comparable ON rag_admin.field_catalog(is_comparable) WHERE is_comparable = TRUE;
CREATE INDEX idx_field_catalog_verifiable ON rag_admin.field_catalog(is_verifiable) WHERE is_verifiable = TRUE;
CREATE INDEX idx_field_catalog_summarizable ON rag_admin.field_catalog(is_summarizable) WHERE is_summarizable = TRUE;
CREATE INDEX idx_field_catalog_recommendable ON rag_admin.field_catalog(is_recommendable) WHERE is_recommendable = TRUE;
CREATE INDEX idx_rules_entity_type ON rag_admin.rules(entity_type);
CREATE INDEX idx_relations_from ON rag_admin.relations(entity_type_from);
CREATE INDEX idx_relations_to ON rag_admin.relations(entity_type_to);
CREATE INDEX idx_facets_entity_type ON rag_admin.facets(entity_type);
CREATE INDEX idx_comparison_metrics_entity_type ON rag_admin.comparison_metrics(entity_type);
CREATE INDEX idx_recommendation_configs_entity_type ON rag_admin.recommendation_configs(entity_type);
CREATE INDEX idx_permissions_entity_type ON rag_admin.permissions(entity_type);
CREATE INDEX idx_permissions_role ON rag_admin.permissions(role);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION rag_admin.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_entity_type_updated_at BEFORE UPDATE ON rag_admin.entity_type FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_field_catalog_updated_at BEFORE UPDATE ON rag_admin.field_catalog FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rag_admin.rules FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_relations_updated_at BEFORE UPDATE ON rag_admin.relations FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_embedding_specs_updated_at BEFORE UPDATE ON rag_admin.embedding_specs FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_facets_updated_at BEFORE UPDATE ON rag_admin.facets FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_comparison_metrics_updated_at BEFORE UPDATE ON rag_admin.comparison_metrics FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_recommendation_configs_updated_at BEFORE UPDATE ON rag_admin.recommendation_configs FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON rag_admin.permissions FOR EACH ROW EXECUTE FUNCTION rag_admin.update_updated_at_column();
