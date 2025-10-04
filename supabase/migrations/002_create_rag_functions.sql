-- Fonctions utilitaires pour le système RAG

-- Fonction pour calculer la couverture des intents par entité
CREATE OR REPLACE FUNCTION rag_admin.calculate_intent_coverage(entity_type_param VARCHAR(100))
RETURNS TABLE (
    entity_type VARCHAR(100),
    total_fields INTEGER,
    findable_count INTEGER,
    comparable_count INTEGER,
    verifiable_count INTEGER,
    summarizable_count INTEGER,
    recommendable_count INTEGER,
    findable_pct DECIMAL(5,2),
    comparable_pct DECIMAL(5,2),
    verifiable_pct DECIMAL(5,2),
    summarizable_pct DECIMAL(5,2),
    recommendable_pct DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fc.entity_type,
        COUNT(*)::INTEGER as total_fields,
        COUNT(*) FILTER (WHERE fc.is_findable = TRUE)::INTEGER as findable_count,
        COUNT(*) FILTER (WHERE fc.is_comparable = TRUE)::INTEGER as comparable_count,
        COUNT(*) FILTER (WHERE fc.is_verifiable = TRUE)::INTEGER as verifiable_count,
        COUNT(*) FILTER (WHERE fc.is_summarizable = TRUE)::INTEGER as summarizable_count,
        COUNT(*) FILTER (WHERE fc.is_recommendable = TRUE)::INTEGER as recommendable_count,
        ROUND((COUNT(*) FILTER (WHERE fc.is_findable = TRUE)::DECIMAL / COUNT(*)) * 100, 2) as findable_pct,
        ROUND((COUNT(*) FILTER (WHERE fc.is_comparable = TRUE)::DECIMAL / COUNT(*)) * 100, 2) as comparable_pct,
        ROUND((COUNT(*) FILTER (WHERE fc.is_verifiable = TRUE)::DECIMAL / COUNT(*)) * 100, 2) as verifiable_pct,
        ROUND((COUNT(*) FILTER (WHERE fc.is_summarizable = TRUE)::DECIMAL / COUNT(*)) * 100, 2) as summarizable_pct,
        ROUND((COUNT(*) FILTER (WHERE fc.is_recommendable = TRUE)::DECIMAL / COUNT(*)) * 100, 2) as recommendable_pct
    FROM rag_admin.field_catalog fc
    WHERE fc.entity_type = entity_type_param
    GROUP BY fc.entity_type;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour valider une règle SQL
CREATE OR REPLACE FUNCTION rag_admin.test_rule(rule_sql TEXT, test_variables JSONB DEFAULT '{}')
RETURNS TABLE (
    passed BOOLEAN,
    message TEXT,
    execution_time_ms INTEGER
) AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    result BOOLEAN;
    error_msg TEXT;
BEGIN
    start_time := clock_timestamp();
    
    BEGIN
        -- Exécuter la règle SQL avec les variables de test
        EXECUTE 'SELECT (' || rule_sql || ')' INTO result USING test_variables;
        
        end_time := clock_timestamp();
        
        RETURN QUERY SELECT 
            COALESCE(result, FALSE) as passed,
            CASE 
                WHEN result IS TRUE THEN 'Règle validée avec succès'
                ELSE 'Règle a échoué'
            END as message,
            EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER as execution_time_ms;
            
    EXCEPTION WHEN OTHERS THEN
        end_time := clock_timestamp();
        error_msg := SQLERRM;
        
        RETURN QUERY SELECT 
            FALSE as passed,
            'Erreur SQL: ' || error_msg as message,
            EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER as execution_time_ms;
    END;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer un manifest d'export
CREATE OR REPLACE FUNCTION rag_admin.generate_export_manifest()
RETURNS JSONB AS $$
DECLARE
    manifest JSONB;
BEGIN
    SELECT jsonb_build_object(
        'version', '1.0.0',
        'exportedAt', NOW()::TEXT,
        'entities', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'entityType', et.entity_type,
                    'titleSingular', et.title_singular,
                    'titlePlural', et.title_plural,
                    'primaryTable', et.primary_table,
                    'primaryKey', et.primary_key,
                    'defaultSummaryTemplate', et.default_summary_template
                )
            )
            FROM rag_admin.entity_type et
        ),
        'fields', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'entityType', fc.entity_type,
                    'columnName', fc.column_name,
                    'dataType', fc.data_type,
                    'isFindable', fc.is_findable,
                    'findSynonyms', fc.find_synonyms,
                    'filterOps', fc.filter_ops,
                    'isComparable', fc.is_comparable,
                    'compareGroup', fc.compare_group,
                    'unit', fc.unit,
                    'normalizer', fc.normalizer,
                    'isVerifiable', fc.is_verifiable,
                    'verifyRuleId', fc.verify_rule_id,
                    'isSummarizable', fc.is_summarizable,
                    'importanceWeight', fc.importance_weight,
                    'isRecommendable', fc.is_recommendable,
                    'recoWeight', fc.reco_weight,
                    'vectorSource', fc.vector_source,
                    'piiLevel', fc.pii_level,
                    'visibilityRole', fc.visibility_role,
                    'provenanceNote', fc.provenance_note
                )
            )
            FROM rag_admin.field_catalog fc
        ),
        'rules', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'ruleId', r.rule_id,
                    'entityType', r.entity_type,
                    'ruleType', r.rule_type,
                    'dslSql', r.dsl_sql,
                    'explanationTemplate', r.explanation_template
                )
            )
            FROM rag_admin.rules r
        ),
        'relations', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'entityTypeFrom', rel.entity_type_from,
                    'entityTypeTo', rel.entity_type_to,
                    'relation', rel.relation,
                    'joinSql', rel.join_sql,
                    'isVerifiable', rel.is_verifiable,
                    'isRecommendable', rel.is_recommendable
                )
            )
            FROM rag_admin.relations rel
        ),
        'facets', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'facetId', f.facet_id,
                    'name', f.name,
                    'entityType', f.entity_type,
                    'columnName', f.column_name,
                    'filterOps', f.filter_ops,
                    'displayOrder', f.display_order
                )
            )
            FROM rag_admin.facets f
        ),
        'comparisonMetrics', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'metricId', cm.metric_id,
                    'name', cm.name,
                    'entityType', cm.entity_type,
                    'columnName', cm.column_name,
                    'unit', cm.unit,
                    'normalizer', cm.normalizer,
                    'direction', cm.direction,
                    'weight', cm.weight
                )
            )
            FROM rag_admin.comparison_metrics cm
        ),
        'recommendationConfigs', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'configId', rc.config_id,
                    'name', rc.name,
                    'entityType', rc.entity_type,
                    'signals', rc.signals,
                    'engine', rc.engine,
                    'topN', rc.top_n
                )
            )
            FROM rag_admin.recommendation_configs rc
        ),
        'permissions', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'permissionId', p.permission_id,
                    'entityType', p.entity_type,
                    'columnName', p.column_name,
                    'role', p.role,
                    'intent', p.intent,
                    'allowed', p.allowed
                )
            )
            FROM rag_admin.permissions p
        )
    ) INTO manifest;
    
    RETURN manifest;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour valider l'intégrité du schéma
CREATE OR REPLACE FUNCTION rag_admin.validate_schema()
RETURNS TABLE (
    is_valid BOOLEAN,
    errors TEXT[],
    warnings TEXT[],
    coverage JSONB
) AS $$
DECLARE
    error_list TEXT[] := '{}';
    warning_list TEXT[] := '{}';
    coverage_data JSONB;
    entity_count INTEGER;
    field_count INTEGER;
    rule_count INTEGER;
    relation_count INTEGER;
BEGIN
    -- Compter les entités
    SELECT COUNT(*) INTO entity_count FROM rag_admin.entity_type;
    
    -- Compter les champs
    SELECT COUNT(*) INTO field_count FROM rag_admin.field_catalog;
    
    -- Compter les règles
    SELECT COUNT(*) INTO rule_count FROM rag_admin.rules;
    
    -- Compter les relations
    SELECT COUNT(*) INTO relation_count FROM rag_admin.relations;
    
    -- Vérifications d'erreurs
    IF entity_count = 0 THEN
        error_list := array_append(error_list, 'Aucune entité définie');
    END IF;
    
    IF field_count = 0 THEN
        error_list := array_append(error_list, 'Aucun champ défini');
    END IF;
    
    -- Vérifier les règles orphelines
    IF EXISTS (
        SELECT 1 FROM rag_admin.field_catalog fc 
        WHERE fc.verify_rule_id IS NOT NULL 
        AND NOT EXISTS (
            SELECT 1 FROM rag_admin.rules r 
            WHERE r.rule_id = fc.verify_rule_id
        )
    ) THEN
        error_list := array_append(error_list, 'Règles orphelines référencées dans field_catalog');
    END IF;
    
    -- Vérifier les relations circulaires
    IF EXISTS (
        SELECT 1 FROM rag_admin.relations r1
        JOIN rag_admin.relations r2 ON r1.entity_type_from = r2.entity_type_to 
        AND r1.entity_type_to = r2.entity_type_from
    ) THEN
        warning_list := array_append(warning_list, 'Relations circulaires détectées');
    END IF;
    
    -- Générer les données de couverture
    SELECT jsonb_agg(
        jsonb_build_object(
            'entityType', ic.entity_type,
            'totalFields', ic.total_fields,
            'findable', ic.findable_pct,
            'comparable', ic.comparable_pct,
            'verifiable', ic.verifiable_pct,
            'summarizable', ic.summarizable_pct,
            'recommendable', ic.recommendable_pct
        )
    ) INTO coverage_data
    FROM rag_admin.calculate_intent_coverage(et.entity_type) ic
    JOIN rag_admin.entity_type et ON et.entity_type = ic.entity_type;
    
    -- Avertissements de couverture faible (simplifié)
    -- Vérifier la couverture globale
    IF EXISTS (
        SELECT 1 FROM rag_admin.calculate_intent_coverage(et.entity_type) ic
        JOIN rag_admin.entity_type et ON et.entity_type = ic.entity_type
        WHERE ic.findable_pct < 20
    ) THEN
        warning_list := array_append(warning_list, 'Certaines entités ont une couverture trouvable faible (< 20%)');
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM rag_admin.calculate_intent_coverage(et.entity_type) ic
        JOIN rag_admin.entity_type et ON et.entity_type = ic.entity_type
        WHERE ic.comparable_pct < 10
    ) THEN
        warning_list := array_append(warning_list, 'Certaines entités ont une couverture comparable faible (< 10%)');
    END IF;
    
    RETURN QUERY SELECT 
        (array_length(error_list, 1) IS NULL OR array_length(error_list, 1) = 0) as is_valid,
        error_list as errors,
        warning_list as warnings,
        coverage_data as coverage;
END;
$$ LANGUAGE plpgsql;
