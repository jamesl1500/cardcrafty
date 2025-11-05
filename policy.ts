/**
 * Route Protection Policies
 * 
 * This file contains helper functions and configurations for route protection
 * and access control throughout the application.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Route access levels
 */
export enum AccessLevel {
  PUBLIC = 'public',
  AUTHENTICATED = 'authenticated',
  ADMIN = 'admin'
}

/**
 * Route configurations with their required access levels
 */
export const routeConfig = {
  // Public routes - no authentication required
  '/': AccessLevel.PUBLIC,
  '/about': AccessLevel.PUBLIC,
  '/contact': AccessLevel.PUBLIC,
  '/features': AccessLevel.PUBLIC,
  '/terms': AccessLevel.PUBLIC,
  '/privacy': AccessLevel.PUBLIC,
  '/auth/login': AccessLevel.PUBLIC,
  '/auth/signup': AccessLevel.PUBLIC,

  // Protected routes - authentication required
  '/dashboard': AccessLevel.AUTHENTICATED,
  '/settings': AccessLevel.AUTHENTICATED,
  '/decks': AccessLevel.AUTHENTICATED,
  '/profile': AccessLevel.AUTHENTICATED,
  '/search': AccessLevel.AUTHENTICATED,

  // Dynamic routes patterns
  '/decks/*': AccessLevel.AUTHENTICATED,
  '/profile/*': AccessLevel.AUTHENTICATED,
} as const

/**
 * Get the current user session
 */
export async function getServerSession() {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session error:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('Failed to get session:', error)
    return null
  }
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/decks',
    '/profile',
    '/search'
  ]

  return protectedRoutes.some(route => pathname.startsWith(route))
}

/**
 * Check if a route is for authentication (login/signup)
 */
export function isAuthRoute(pathname: string): boolean {
  const authRoutes = ['/auth/login', '/auth/signup']
  return authRoutes.some(route => pathname.startsWith(route))
}

/**
 * Protect a page component with authentication
 * Usage: await protectPage() in page components
 */
export async function protectPage(redirectTo?: string) {
  const session = await getServerSession()
  console.log('protectPage session:', session);
  if (!session) {
    const loginUrl = redirectTo 
      ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/auth/login'
    redirect(loginUrl)
  }
  
  return session
}

/**
 * Redirect authenticated users away from auth pages
 * Usage: await redirectIfAuthenticated() in login/signup pages
 */
export async function redirectIfAuthenticated(defaultRedirect = '/dashboard') {
  const session = await getServerSession()
  
  if (session) {
    redirect(defaultRedirect)
  }
}

/**
 * Get user role from session
 */
export function getUserRole(session: { user?: { user_metadata?: { role?: string } } } | null): 'admin' | 'user' {
  // Check for admin role in user metadata
  return session?.user?.user_metadata?.role === 'admin' ? 'admin' : 'user'
}

/**
 * Check if user has required access level
 */
export function hasAccess(userRole: 'admin' | 'user', requiredLevel: AccessLevel): boolean {
  switch (requiredLevel) {
    case AccessLevel.PUBLIC:
      return true
    case AccessLevel.AUTHENTICATED:
      return userRole === 'user' || userRole === 'admin'
    case AccessLevel.ADMIN:
      return userRole === 'admin'
    default:
      return false
  }
}