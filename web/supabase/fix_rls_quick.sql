-- Quick fix for RLS warnings
-- Run this in Supabase SQL Editor

-- 1. Enable RLS on analysis_cache table
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;

-- 2. Create a simple policy to allow authenticated users to manage their own data
CREATE POLICY "Enable access for authenticated users only" ON public.analysis_cache
    FOR ALL
    USING (auth.uid() IS NOT NULL)
    WITH CHECK (auth.uid() IS NOT NULL);

-- If you have other tables without RLS, add them here:
-- ALTER TABLE public.your_table_name ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable access for authenticated users only" ON public.your_table_name
--     FOR ALL
--     USING (auth.uid() IS NOT NULL)
--     WITH CHECK (auth.uid() IS NOT NULL);