-- Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Fix overly permissive RLS policy on error_logs
-- Drop the permissive policy and create a proper one
DROP POLICY IF EXISTS "Authenticated can insert error_logs" ON public.error_logs;

-- Create a new policy that restricts inserts to the user's own errors
CREATE POLICY "Users can insert their own error logs" ON public.error_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User can only insert error logs for themselves or with null user_id for anonymous errors
    user_id IS NULL OR auth.uid() = user_id
  );