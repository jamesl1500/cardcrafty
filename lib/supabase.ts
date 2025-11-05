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

import { createClient } from '@supabase/supabase-js';

/**
 * supabaseUrl
 * 
 * The URL of the Supabase project, retrieved from environment variables.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;

/**
 * supabaseAnonKey
 * 
 * The anonymous key for accessing the Supabase project, retrieved from environment variables.
 */
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * supabaseServiceRoleKey
 * 
 * The service role key for admin access to the Supabase project, retrieved from environment variables.
 */
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY as string;

/**
 * supabase
 * 
 * The Supabase client instance for general use with proper auth configuration.
 * 
 * @returns {SupabaseClient} The Supabase client
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/** supabaseAdmin
 * 
 * The Supabase client instance with service role access for admin operations.
 * 
 * @returns {SupabaseClient} The Supabase client with admin privileges
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
