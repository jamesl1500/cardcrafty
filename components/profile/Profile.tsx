"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Clock,
  Edit2,
  Eye,
  Gift,
  Globe,
  MapPin,
  Share2,
  Star,
  Trophy,
  TrendingUp,
  Users,
  User,
  ArrowRight,
  Award,
  CheckCircle,
  BarChart3,
  PlusCircle,
  Target,
  Icon,
  LucideIcon,
  Settings,
  Share,
  Twitter,
  Facebook,
  Linkedin,
  BookOpen,
  Zap
} from 'lucide-react'
import { DeckService } from '@/lib/deck-service'
import { DashboardService } from '@/lib/dashboard-service'
import type { Deck, Flashcard } from '@/lib/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

/**
 * ProfileStats
 * 
 * Represents various statistics for a user's profile.
 */
interface ProfileStats {
  totalDecks: number
  totalFlashcards: number
  studyStreak: number
  totalStudyTime: number
  averageScore: number
  level: number
  xp: number
  nextLevelXp: number
}

/**
 * Achievement
 * 
 * Represents a user achievement or badge.
 */
interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export default function Profile({ user }: { user: SupabaseUser | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userDecks, setUserDecks] = useState<Deck[]>([])
  const [recentFlashcards, setRecentFlashcards] = useState<Flashcard[]>([])
  const [stats, setStats] = useState<ProfileStats>({
    totalDecks: 0,
    totalFlashcards: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    averageScore: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100
  })
  const [achievements, setAchievements] = useState<Achievement[]>([])

  // Helper function to get user ID from either user type
  const getUserId = (user: SupabaseUser | null) => {
    if (!user) return null
    return user.id
  }

  // Helper function to get user metadata from either user type
  const getUserMetadata = (user: SupabaseUser | null) => {
    if (!user) return {}
    return user.user_metadata
  }

  // Helper function to get user email from either user type  
  const getUserEmail = (user: SupabaseUser | null) => {
    if (!user) return null
    return user.email
  }

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true)

        if (!user) {
          router.push('/auth/login')
          return
        }

        // Load user's decks
        const userId = getUserId(user)
        if (!userId) return
        
        const decks = await DeckService.getUserDecks(userId)
        setUserDecks(decks)

        // Load dashboard data for recent flashcards
        const dashboardData = await DashboardService.getDashboardData()
        setRecentFlashcards(dashboardData.unattachedFlashcards.slice(0, 6))

        // Calculate stats
        const totalFlashcards = decks.reduce((sum, deck) => sum + (deck.flashcard_count || 0), 0)
        setStats({
          totalDecks: decks.length,
          totalFlashcards,
          studyStreak: Math.floor(Math.random() * 30) + 1, // Mock data
          totalStudyTime: Math.floor(Math.random() * 100) + 20, // Mock hours
          averageScore: Math.floor(Math.random() * 30) + 70, // Mock score 70-100%
          level: Math.floor(totalFlashcards / 50) + 1,
          xp: (totalFlashcards * 10) % 100,
          nextLevelXp: 100
        })

        // Mock achievements
        setAchievements([
          {
            id: '1',
            title: 'First Steps',
            description: 'Created your first deck',
            icon: '🎯',
            unlockedAt: '2024-10-15',
            rarity: 'common'
          },
          {
            id: '2',
            title: 'Study Streak',
            description: 'Studied for 7 days in a row',
            icon: '🔥',
            unlockedAt: '2024-10-22',
            rarity: 'rare'
          },
          {
            id: '3',
            title: 'Card Master',
            description: 'Created 100 flashcards',
            icon: '⭐',
            unlockedAt: '2024-11-01',
            rarity: 'epic'
          }
        ])

      } catch (error) {
        console.error('Error loading profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfileData()
  }, [router])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800'
      case 'rare': return 'bg-blue-100 text-blue-800'
      case 'epic': return 'bg-purple-100 text-purple-800'
      case 'legendary': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const [shareModalOpen, setShareModalOpen] = useState(false)

  const copyProfileLink = () => {
    const userId = getUserId(user)
    const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile/${userId}`
    navigator.clipboard.writeText(profileUrl)
    alert('Profile link copied to clipboard!')
  }

  const shareToSocial = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const userId = getUserId(user)
    const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/profile/${userId}`
    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent("Check out my profile on CardCrafty!")}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
        break
    }

    window.open(shareUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userMetadata = getUserMetadata(user) || {}
  const userEmail = getUserEmail(user)
  const displayName = userMetadata.first_name && userMetadata.last_name ? `${userMetadata.first_name} ${userMetadata.last_name}` : userEmail?.split('@')[0] || 'User'
  const bio = userMetadata.bio || "Passionate learner exploring new topics every day!"
  const location = userMetadata.location || ''
  const website = userMetadata.website || ''

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black h-32"></div>
        <CardContent className="relative pt-14 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={userMetadata.avatar_url} />
                <AvatarFallback className="text-xl bg-white text-gray-700">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-black">{displayName}</h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
                {user && (
                <Button variant="default" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              )}
                <Button variant="outline" size="sm" onClick={() => setShareModalOpen(true)}>
                <Share className="h-4 w-4 mr-2" />
                Share
                </Button>

                {/* Share Profile Modal */}
                {shareModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-80 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Share Profile</h3>
                    <Button variant="default" size="sm" onClick={() => setShareModalOpen(false)}>
                    ×
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your learning journey with others
                  </p>

                  <div className="space-y-3">
                    <Button 
                    variant="outline" 
                    className="w-full justify-start text-blue-600 hover:bg-blue-50"
                    onClick={() => shareToSocial('twitter')}
                    >
                    <div className="w-6 h-6 p-1 mr-3 bg-blue-400 rounded">
                      <Twitter className="h-3 w-3 text-white" />
                    </div>
                    Share on Twitter
                    </Button>
                    
                    <Button 
                    variant="outline" 
                    className="w-full justify-start text-blue-800 hover:bg-blue-50"
                    onClick={() => shareToSocial('facebook')}
                    >
                    <div className="w-6 h-6 p-1 mr-3 bg-blue-600 rounded">
                      <Facebook className="h-3 w-3 text-white" />
                    </div>
                    Share on Facebook
                    </Button>
                    
                    <Button 
                    variant="outline" 
                    className="w-full justify-start text-blue-700 hover:bg-blue-50"
                    onClick={() => shareToSocial('linkedin')}
                    >
                    <div className="w-6 h-6 p-1 mr-3 bg-blue-700 rounded">
                      <Linkedin className="h-3 w-3 text-white" />
                    </div>
                    Share on LinkedIn
                    </Button>
                    
                    <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-gray-50"
                    onClick={copyProfileLink}
                    >
                    <div className="w-6 h-6 mr-1 p-1 bg-gray-400 rounded">
                      <Linkedin className="h-2 w-2 text-white" />
                    </div>
                    Copy Link
                    </Button>
                  </div>
                  </div>
                </div>
                )}
            </div>
          </div>

          {/* Bio and Details */}
          <div className="mt-6 space-y-3">
            <p className="text-black/90 max-w-2xl">{bio}</p>
            <div className="flex flex-wrap gap-4 text-sm text-black/90">
              {location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location}
                </div>
              )}
              {website && (
                <div className="flex items-center gap-1 text-black/90">
                  <Globe className="h-4 w-4" />
                  <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1 text-black/90">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(user.created_at)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalDecks}</div>
            <div className="text-sm text-muted-foreground">Decks</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalFlashcards}</div>
            <div className="text-sm text-muted-foreground">Cards</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.studyStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalStudyTime}</div>
            <div className="text-sm text-muted-foreground">Hours</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="decks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="decks">My Decks</TabsTrigger>
        </TabsList>

        {/* Decks Tab */}
        <TabsContent value="decks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Study Decks ({userDecks.length})
              </CardTitle>
              <CardDescription>
                All the decks you&apos;ve created for studying
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userDecks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No decks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first deck to start your learning journey!
                  </p>
                  <Button asChild>
                    <Link href="/decks/new">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Create Your First Deck
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {userDecks.map((deck) => (
                    <Card key={deck.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div 
                          className="w-full h-2 rounded-full mb-3"
                          style={{ backgroundColor: deck.color }}
                        />
                        <h3 className="font-semibold mb-2 line-clamp-2">{deck.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {deck.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <span>{deck.flashcard_count || 0} cards</span>
                          <Badge variant={deck.is_public ? "default" : "secondary"} className="text-xs">
                            {deck.is_public ? "Public" : "Private"}
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full" asChild>
                          <Link href={`/decks/${deck.id}/study`}>
                            Study Deck
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}