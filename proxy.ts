/**
 * Route Protection Proxy (Next.js 16)
 * 
 * This file contains the main proxy function and helper functions for route protection
 * and access control throughout the application.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Main proxy function - runs for every request (Next.js 16)
 */
export default async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get the current user session
  const { data: { session } } = await supabase.auth.getSession()
  
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  // Protect authenticated routes
  if (!session && isProtectedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

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
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    console.log('getServerSession session:', session)
    
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