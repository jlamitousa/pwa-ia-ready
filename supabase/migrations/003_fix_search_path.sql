-- Fix search_path to include rag_admin schema
-- This ensures that tables in rag_admin schema are found without explicit schema prefix

-- Set search_path for the current session
SET search_path = rag_admin, public, extensions;

-- Set search_path for the database (affects all new connections)
ALTER DATABASE postgres SET search_path = rag_admin, public, extensions;

-- Set search_path for the postgres user (affects all connections from this user)
ALTER USER postgres SET search_path = rag_admin, public, extensions;

-- Grant usage on the schema to the postgres user (if not already granted)
GRANT USAGE ON SCHEMA rag_admin TO postgres;
GRANT USAGE ON SCHEMA rag_admin TO anon;
GRANT USAGE ON SCHEMA rag_admin TO authenticated;
GRANT USAGE ON SCHEMA rag_admin TO service_role;

-- Grant all privileges on all tables in rag_admin schema
GRANT ALL ON ALL TABLES IN SCHEMA rag_admin TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA rag_admin TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA rag_admin TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA rag_admin TO service_role;

-- Grant all privileges on all sequences in rag_admin schema
GRANT ALL ON ALL SEQUENCES IN SCHEMA rag_admin TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA rag_admin TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA rag_admin TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA rag_admin TO service_role;

-- Grant execute on all functions in rag_admin schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rag_admin TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rag_admin TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rag_admin TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA rag_admin TO service_role;
