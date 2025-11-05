"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, StarIcon, MoreHorizontal, Move } from 'lucide-react'
import type { Flashcard } from '@/lib/types'

interface FlashcardItemProps {
  flashcard: Flashcard
  onToggleStar?: (id: string, isStarred: boolean) => void
  onMoveToDecks?: (id: string) => void
}

export default function FlashcardItem({ flashcard, onToggleStar, onMoveToDecks }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleToggleStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleStar?.(flashcard.id, !flashcard.is_starred)
  }

  const handleMoveToDecks = (e: React.MouseEvent) => {
    e.stopPropagation()
    onMoveToDecks?.(flashcard.id)
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all duration-200 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Unattached
            </Badge>
            {flashcard.difficulty && (
              <Badge 
                variant={
                  flashcard.difficulty === 'easy' ? 'secondary' :
                  flashcard.difficulty === 'medium' ? 'default' : 'destructive'
                }
                className="text-xs"
              >
                {flashcard.difficulty}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleToggleStar}
              className="h-6 w-6 p-0"
            >
              {flashcard.is_starred ? (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarIcon className="h-3 w-3" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMoveToDecks}
              className="h-6 w-6 p-0"
            >
              <Move className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="min-h-[80px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium mb-2 text-muted-foreground">
              {isFlipped ? 'Back' : 'Front'}
            </p>
            <p className="text-base leading-relaxed">
              {isFlipped ? flashcard.back : flashcard.front}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
          <span>Created {formatDate(flashcard.created_at)}</span>
          <span className="text-primary">Click to flip</span>
        </div>
      </CardContent>
    </Card>
  )
}