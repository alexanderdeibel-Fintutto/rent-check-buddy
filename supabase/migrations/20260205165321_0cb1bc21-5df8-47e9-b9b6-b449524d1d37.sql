-- ============================================
-- Fix 1: Make admin_logs append-only (no DELETE)
-- ============================================

-- Drop the overly permissive service_role policy that allows DELETE
DROP POLICY IF EXISTS "Service role full access admin_logs" ON public.admin_logs;

-- Create separate policies for service_role: only INSERT and SELECT (no UPDATE, no DELETE)
-- This makes the audit log append-only and prevents tampering

-- Service role can insert logs
CREATE POLICY "Service role can insert admin logs" ON public.admin_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can read logs
CREATE POLICY "Service role can read admin logs" ON public.admin_logs
  FOR SELECT
  TO service_role
  USING (true);

-- Note: Deliberately NOT creating UPDATE or DELETE policies for service_role
-- This ensures audit logs are immutable once written