"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, BookOpen, Users, Lock } from 'lucide-react'
import { DeckService } from '@/lib/deck-service'
import type { Deck } from '@/lib/types'

export default function DecksListPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [filteredDecks, setFilteredDecks] = useState<Deck[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDecks()
  }, [])

  useEffect(() => {
    // Filter decks based on search query
    if (searchQuery.trim() === '') {
      setFilteredDecks(decks)
    } else {
      const filtered = decks.filter(deck =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredDecks(filtered)
    }
  }, [decks, searchQuery])

  const loadDecks = async () => {
    try {
      setLoading(true)
      setError(null)
      const deckData = await DeckService.getUserDecks()
      setDecks(deckData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load decks')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your decks...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>Failed to load your decks</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={loadDecks} className="w-full">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Study Decks</h1>
          <p className="text-muted-foreground">
            Manage and organize your flashcard collections
          </p>
        </div>
        <Button asChild>
          <Link href="/decks/new">
            <Plus className="h-4 w-4 mr-2" />
            New Deck
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search decks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-5">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Decks</p>
                <p className="text-2xl font-bold">{decks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-5">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Public Decks</p>
                <p className="text-2xl font-bold">{decks.filter(d => d.is_public).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-5">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Private Decks</p>
                <p className="text-2xl font-bold">{decks.filter(d => !d.is_public).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decks Grid */}
      {filteredDecks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            {searchQuery ? (
              <>
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No decks found</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  No decks match your search for &quot;{searchQuery}&quot;. Try different keywords.
                </p>
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDecks.map((deck) => (
            <Card key={deck.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <Link href={`/decks/${deck.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div 
                      className="w-full h-2 rounded-full mb-3"
                      style={{ backgroundColor: deck.color }}
                    />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {deck.title}
                  </CardTitle>
                  <CardDescription>
                    {deck.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{deck.flashcard_count || 0} cards</span>
                      </div>
                      <span>Updated {formatDate(deck.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={deck.is_public ? "default" : "secondary"}>
                        {deck.is_public ? 'Public' : 'Private'}
                      </Badge>
                      {deck.is_public ? (
                        <Users className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}