-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS public.analysis_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.github_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies for analysis_cache table
-- Allow authenticated users to read their own analysis cache
CREATE POLICY "Users can view their own analysis cache" ON public.analysis_cache
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own analysis cache
CREATE POLICY "Users can insert their own analysis cache" ON public.analysis_cache
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own analysis cache
CREATE POLICY "Users can update their own analysis cache" ON public.analysis_cache
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own analysis cache
CREATE POLICY "Users can delete their own analysis cache" ON public.analysis_cache
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for users table (if exists)
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create policies for user_settings table (if exists)
-- Allow users to view their own settings
CREATE POLICY "Users can view own settings" ON public.user_settings
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own settings
CREATE POLICY "Users can insert own settings" ON public.user_settings
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own settings
CREATE POLICY "Users can update own settings" ON public.user_settings
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policies for github_tokens table (if exists)
-- Allow users to view their own tokens
CREATE POLICY "Users can view own tokens" ON public.github_tokens
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own tokens
CREATE POLICY "Users can insert own tokens" ON public.github_tokens
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own tokens
CREATE POLICY "Users can update own tokens" ON public.github_tokens
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own tokens
CREATE POLICY "Users can delete own tokens" ON public.github_tokens
    FOR DELETE
    USING (auth.uid() = user_id);