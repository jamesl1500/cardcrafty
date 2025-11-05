"use client"

/**
 * Header.tsx
 * 
 * This component renders the header/navigation bar for the application.
 * It includes the logo, navigation links, user authentication status,
 * and responsive design for mobile and desktop views.
 * 
 * Features:
 * - Displays different navigation options based on user authentication status.
 * - Responsive design with a mobile menu toggle.
 * - User avatar and dropdown menu for profile and settings.
 * - Sign out functionality.
 * 
 * @exports Header
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  BookOpen, 
  Home, 
  Settings, 
  LogOut, 
  User as UserIcon,
  Menu, 
  X,
  Search,
  Plus
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface HeaderProps {
  className?: string
}

/**
 * Header component
 * 
 * Renders the header/navigation bar for the application.
 * 
 * @param {HeaderProps} props - The component props
 * @returns {JSX.Element} The rendered Header component
 */
export default function Header({ className }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const getUserInitials = (user: User | null) => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name[0]}${user.user_metadata.last_name[0]}`.toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return 'U'
  }

  const getUserDisplayName = (user: User | null) => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
    }
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    return user?.email || 'User'
  }

  // Don't show header on auth pages
  if (pathname.startsWith('/auth')) {
    return null
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
            </Link>

            {/* Desktop Navigation */}
            {user ? (
              <nav className="hidden md:flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive('/dashboard') 
                      ? 'text-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/decks" 
                  className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive('/decks') 
                      ? 'text-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  My Decks
                </Link>
              </nav>
            ) : (
              <nav className="hidden md:flex items-center gap-4">
                <Link 
                  href="/features" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive('/features') 
                      ? 'text-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  Features
                </Link>
                <Link 
                  href="/about" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive('/about') 
                      ? 'text-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                    isActive('/contact') 
                      ? 'text-foreground bg-accent' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  Contact
                </Link>
              </nav>
            )}
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search (when logged in) */}
            {user && (
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link href="/search">
                  <Search className="h-4 w-4" />
                </Link>
              </Button>
            )}

            {/* Create button (when logged in) */}
            {user && (
              <Button asChild size="sm" className="hidden md:flex">
                <Link href="/decks/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Link>
              </Button>
            )}

            {/* Auth buttons or User menu */}
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName(user)} />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{getUserDisplayName(user)}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/profile/${user.id}`}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-1">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive('/dashboard') 
                    ? 'text-foreground bg-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                href="/decks" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive('/decks') 
                    ? 'text-foreground bg-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                My Decks
              </Link>
              <Link 
                href="/search" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive('/search') 
                    ? 'text-foreground bg-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link 
                href="/decks/new" 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors px-3 py-2 rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="h-4 w-4" />
                Create Deck
              </Link>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={getUserDisplayName(user)} />
                    <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{getUserDisplayName(user)}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="h-4 w-4" />
                  Profile
                </Link>
                <Link 
                  href="/settings" 
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors px-3 py-2 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors px-3 py-2 rounded-md text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
