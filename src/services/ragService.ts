import { createSupabaseClient } from '@/lib/supabase'
import { 
  EntityType, 
  FieldCatalog, 
  Rule, 
  Relation, 
  EmbeddingSpec,
  Facet,
  ComparisonMetric,
  RecommendationConfig,
  Permission,
  IntentCoverage,
  ValidationResult,
  ExportManifest
} from '@/types/rag'

const supabase = createSupabaseClient()

export class RAGService {
  // Entity Types
  static async getEntityTypes(): Promise<EntityType[]> {
    const { data, error } = await supabase
      .from('entity_type')
      .select('*')
      .order('entity_type')
    
    if (error) throw error
    return data || []
  }

  static async getEntityType(entityType: string): Promise<EntityType | null> {
    const { data, error } = await supabase
      .from('entity_type')
      .select('*')
      .eq('entity_type', entityType)
      .single()
    
    if (error) throw error
    return data
  }

  static async createEntityType(entityType: EntityType): Promise<EntityType> {
    const { data, error } = await supabase
      .from('entity_type')
      .insert(entityType)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateEntityType(entityType: string, updates: Partial<EntityType>): Promise<EntityType> {
    const { data, error } = await supabase
      .from('entity_type')
      .update(updates)
      .eq('entity_type', entityType)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteEntityType(entityType: string): Promise<void> {
    const { error } = await supabase
      .from('entity_type')
      .delete()
      .eq('entity_type', entityType)
    
    if (error) throw error
  }

  // Field Catalog
  static async getFieldCatalog(entityType?: string): Promise<FieldCatalog[]> {
    let query = supabase
      .from('field_catalog')
      .select('*')
      .order('entity_type', { ascending: true })
      .order('column_name', { ascending: true })
    
    if (entityType) {
      query = query.eq('entity_type', entityType)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async getFieldCatalogItem(entityType: string, columnName: string): Promise<FieldCatalog | null> {
    const { data, error } = await supabase
      .from('field_catalog')
      .select('*')
      .eq('entity_type', entityType)
      .eq('column_name', columnName)
      .single()
    
    if (error) throw error
    return data
  }

  static async createFieldCatalogItem(field: FieldCatalog): Promise<FieldCatalog> {
    const { data, error } = await supabase
      .from('field_catalog')
      .insert(field)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateFieldCatalogItem(
    entityType: string, 
    columnName: string, 
    updates: Partial<FieldCatalog>
  ): Promise<FieldCatalog> {
    const { data, error } = await supabase
      .from('field_catalog')
      .update(updates)
      .eq('entity_type', entityType)
      .eq('column_name', columnName)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteFieldCatalogItem(entityType: string, columnName: string): Promise<void> {
    const { error } = await supabase
      .from('field_catalog')
      .delete()
      .eq('entity_type', entityType)
      .eq('column_name', columnName)
    
    if (error) throw error
  }

  // Rules
  static async getRules(entityType?: string): Promise<Rule[]> {
    let query = supabase
      .from('rules')
      .select('*')
      .order('entity_type', { ascending: true })
      .order('rule_id', { ascending: true })
    
    if (entityType) {
      query = query.eq('entity_type', entityType)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async getRule(ruleId: string): Promise<Rule | null> {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .eq('rule_id', ruleId)
      .single()
    
    if (error) throw error
    return data
  }

  static async createRule(rule: Rule): Promise<Rule> {
    const { data, error } = await supabase
      .from('rules')
      .insert(rule)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateRule(ruleId: string, updates: Partial<Rule>): Promise<Rule> {
    const { data, error } = await supabase
      .from('rules')
      .update(updates)
      .eq('rule_id', ruleId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteRule(ruleId: string): Promise<void> {
    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('rule_id', ruleId)
    
    if (error) throw error
  }

  // Relations
  static async getRelations(entityType?: string): Promise<Relation[]> {
    let query = supabase
      .from('relations')
      .select('*')
      .order('entity_type_from', { ascending: true })
      .order('entity_type_to', { ascending: true })
    
    if (entityType) {
      query = query.or(`entity_type_from.eq.${entityType},entity_type_to.eq.${entityType}`)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async createRelation(relation: Relation): Promise<Relation> {
    const { data, error } = await supabase
      .from('relations')
      .insert(relation)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateRelation(id: number, updates: Partial<Relation>): Promise<Relation> {
    const { data, error } = await supabase
      .from('relations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteRelation(id: number): Promise<void> {
    const { error } = await supabase
      .from('relations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // Intent Coverage
  static async getIntentCoverage(entityType?: string): Promise<IntentCoverage[]> {
    let query = supabase.rpc('calculate_intent_coverage', { entity_type_param: entityType || '' })
    
    if (entityType) {
      const { data, error } = await query
      if (error) throw error
      return data || []
    } else {
      // Pour toutes les entités
      const entityTypes = await this.getEntityTypes()
      const coveragePromises = entityTypes.map(et => 
        supabase.rpc('calculate_intent_coverage', { entity_type_param: et.entityType })
      )
      
      const results = await Promise.all(coveragePromises)
      const allCoverage: IntentCoverage[] = []
      
      results.forEach(({ data, error }) => {
        if (error) throw error
        if (data) allCoverage.push(...data)
      })
      
      return allCoverage
    }
  }

  // Validation
  static async validateSchema(): Promise<ValidationResult> {
    const { data, error } = await supabase.rpc('validate_schema')
    
    if (error) throw error
    return data[0] || { isValid: false, errors: [], warnings: [], coverage: [] }
  }

  // Export
  static async generateExportManifest(): Promise<ExportManifest> {
    const { data, error } = await supabase.rpc('generate_export_manifest')
    
    if (error) throw error
    return data
  }

  // Test Rule
  static async testRule(ruleSql: string, testVariables: Record<string, any> = {}): Promise<{
    passed: boolean
    message: string
    executionTime: number
  }> {
    const { data, error } = await supabase.rpc('test_rule', {
      rule_sql: ruleSql,
      test_variables: testVariables
    })
    
    if (error) throw error
    return data[0] || { passed: false, message: 'Erreur inconnue', executionTime: 0 }
  }
}
