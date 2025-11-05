"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Lock } from 'lucide-react'
import type { Deck } from '@/lib/types'

interface DeckCardProps {
  deck: Deck
}

export default function DeckCard({ deck }: DeckCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <Link href={`/decks/${deck.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {deck.title}
              </CardTitle>
              <CardDescription className="mt-1">
                {deck.description || 'No description'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {deck.is_public ? (
                <Users className="h-4 w-4 text-green-600" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>{deck.flashcard_count || 0} cards</span>
              </div>
              <span>Updated {formatDate(deck.updated_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={deck.is_public ? "default" : "secondary"}>
                {deck.is_public ? 'Public' : 'Private'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}