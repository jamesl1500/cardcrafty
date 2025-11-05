"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, BookOpen, Brain } from 'lucide-react'
import Link from 'next/link'

import StatsCards from './StatsCards'
import DeckCard from './DeckCard'
import FlashcardItem from './FlashcardItem'
import { DashboardService } from '@/lib/dashboard-service'
import type { DashboardData } from '@/lib/types'

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await DashboardService.getDashboardData()
      setDashboardData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFlashcardStar = async (flashcardId: string, isStarred: boolean) => {
    // TODO: Implement star toggle functionality
    console.log('Toggle star for flashcard:', flashcardId, isStarred)
  }

  const handleMoveFlashcardToDecks = async (flashcardId: string) => {
    // TODO: Implement move to decks functionality
    console.log('Move flashcard to decks:', flashcardId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>Failed to load dashboard data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadDashboardData} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { decks, unattachedFlashcards, stats } = dashboardData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Ready to continue learning?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/decks/new">
              <Plus className="h-4 w-4 mr-2" />
              New Deck
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards {...stats} />

      {/* Main Content */}
      <Tabs defaultValue="decks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="decks" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Study Decks ({decks.length})
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Unattached Cards ({unattachedFlashcards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="decks" className="space-y-6">
          {decks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No study decks yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  Create your first deck to organize your flashcards and start studying more effectively.
                </p>
                <Button asChild>
                  <Link href="/decks/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Deck
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-6">
          {unattachedFlashcards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No unattached flashcards</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  All your flashcards are organized in decks. Create individual flashcards for quick study sessions.
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quick Flashcard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {unattachedFlashcards.map((flashcard) => (
                <FlashcardItem
                  key={flashcard.id}
                  flashcard={flashcard}
                  onToggleStar={handleToggleFlashcardStar}
                  onMoveToDecks={handleMoveFlashcardToDecks}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}