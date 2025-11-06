/**
 * supabase.ts
 *
 * This file initializes and exports the Supabase client for use throughout the application.
 * It uses environment variables to configure the Supabase URL and anonymous key.
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_SUPABASE_URL: The URL of the Supabase project.
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: The anonymous key for accessing the Supabase project.
 * - NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: The service role key for admin access to the Supabase project.
 * 
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

/**
 * supabaseUrl
 * 
 * The URL of the Supabase project, retrieved from environment variables.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

/**
 * supabaseServiceRoleKey
 * 
 * The service role key for admin access to the Supabase project, retrieved from environment variables.
 */
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

/**
 * supabase
 * 
 * The Supabase client instance for browser use with cookie-based authentication.
 * This ensures compatibility with server-side authentication checks.
 * 
 * @returns {SupabaseClient} The Supabase client
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/** supabaseAdmin
 * 
 * The Supabase client instance with service role access for admin operations.
 * 
 * @returns {SupabaseClient} The Supabase client with admin privileges
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
