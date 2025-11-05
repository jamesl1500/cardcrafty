"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  Play, 
  MoreHorizontal, 
  Star, 
  StarIcon,
  BookOpen,
  Users,
  Lock,
  Save,
  X,
  Import,
  Search
} from 'lucide-react'
import { DeckService } from '@/lib/deck-service'
import type { Deck, Flashcard } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export default function DeckViewPage() {
  const params = useParams()
  const router = useRouter()
  const deckId = params.deckId as string

  const [deck, setDeck] = useState<Deck | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Edit states
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ title: '', description: '', color: '#ffffff', is_public: false })
  const [isUpdating, setIsUpdating] = useState(false)
  
  // New flashcard states
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [newCardData, setNewCardData] = useState({ front: '', back: '' })
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddingCardLoading, setIsAddingCardLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  
  // Flashcard flip states
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set())
  
  // Edit flashcard states
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [editCardData, setEditCardData] = useState({ front: '', back: '' })
  const [isUpdatingCard, setIsUpdatingCard] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [deckData, flashcardData] = await Promise.all([
          DeckService.getDeckById(deckId),
          DeckService.getDeckFlashcards(deckId)
        ])
        
        if (!deckData) {
          setError('Deck not found')
          return
        }
        
        setDeck(deckData)
        setFlashcards(flashcardData)
        setEditData({ title: deckData.title, description: deckData.description || '', color: deckData.color || '#ffffff', is_public: deckData.is_public })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deck')
      } finally {
        setLoading(false)
      }
    }

    if (deckId) {
      loadData()
    }
  }, [deckId])

  const handleUpdateDeck = async () => {
    if (!deck) return
    
    try {
      setIsUpdating(true)
      const updatedDeck = await DeckService.updateDeck(deck.id, {
        title: editData.title,
        description: editData.description,
        color: editData.color,
        is_public: editData.is_public
      })
      setDeck(updatedDeck)
      setIsEditing(false)
    } catch (err) {
      console.error('Error updating deck:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteDeck = async () => {
    if (!deck || !confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return
    }
    
    try {
      await DeckService.deleteDeck(deck.id)
      router.push('/decks')
    } catch (err) {
      console.error('Error deleting deck:', err)
    }
  }

  const handleAddFlashcard = async () => {
    if (!newCardData.front.trim() || !newCardData.back.trim()) {
      return
    }
    
    try {
      setIsAddingCardLoading(true)
      const newCard = await DeckService.addFlashcardToDeck(deckId, newCardData)
      setFlashcards(prev => [newCard, ...prev])
      setNewCardData({ front: '', back: '' })
      setIsAddingCard(false)
      
      // Update deck flashcard count
      if (deck) {
        setDeck(prev => prev ? { ...prev, flashcard_count: (prev.flashcard_count || 0) + 1 } : null)
      }
    } catch (err) {
      console.error('Error adding flashcard:', err)
    } finally {
      setIsAddingCardLoading(false)
    }
  }

  const handleToggleFlashcardStar = async (flashcardId: string, isStarred: boolean) => {
    try {
      const updatedCard = await DeckService.updateFlashcard(flashcardId, { is_starred: isStarred })
      setFlashcards(prev => prev.map(card => 
        card.id === flashcardId ? updatedCard : card
      ))
    } catch (err) {
      console.error('Error updating flashcard:', err)
    }
  }

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) {
      return
    }
    
    try {
      await DeckService.deleteFlashcard(flashcardId)
      setFlashcards(prev => prev.filter(card => card.id !== flashcardId))
      
      // Update deck flashcard count
      if (deck) {
        setDeck(prev => prev ? { ...prev, flashcard_count: Math.max(0, (prev.flashcard_count || 1) - 1) } : null)
      }
    } catch (err) {
      console.error('Error deleting flashcard:', err)
    }
  }

  const handleFlipCard = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const handleStartEditCard = (flashcard: Flashcard) => {
    setEditingCardId(flashcard.id)
    setEditCardData({ front: flashcard.front, back: flashcard.back })
    // Clear flip state when editing
    setFlippedCards(prev => {
      const newSet = new Set(prev)
      newSet.delete(flashcard.id)
      return newSet
    })
  }

  const handleCancelEditCard = () => {
    setEditingCardId(null)
    setEditCardData({ front: '', back: '' })
  }

  const handleUpdateFlashcard = async () => {
    if (!editingCardId || !editCardData.front.trim() || !editCardData.back.trim()) {
      return
    }
    
    try {
      setIsUpdatingCard(true)
      const updatedCard = await DeckService.updateFlashcard(editingCardId, {
        front: editCardData.front,
        back: editCardData.back
      })
      setFlashcards(prev => prev.map(card => 
        card.id === editingCardId ? updatedCard : card
      ))
      setEditingCardId(null)
      setEditCardData({ front: '', back: '' })
    } catch (err) {
      console.error('Error updating flashcard:', err)
    } finally {
      setIsUpdatingCard(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const importFlashcards = async (isStarredOnly: boolean) => {
    try {
      setIsImporting(true)
      const importedCards = await DeckService.importFlashcards(deckId, isStarredOnly)
      setFlashcards(prev => [...importedCards, ...prev])
      
      // Update deck flashcard count
      if (deck) {
        setDeck(prev => prev ? { ...prev, flashcard_count: (prev.flashcard_count || 0) + importedCards.length } : null)
      }
    } catch (err) {
      console.error('Error importing flashcards:', err)
    } finally {
      setIsImporting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading deck...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
              <CardDescription>{error || 'Deck not found'}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/decks">Back to Decks</Link>
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/decks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Link>
        </Button>
      </div>

      {/* Deck Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div 
                className="w-full h-2 rounded-full mb-4"
                style={{ backgroundColor: deck.color }}
              />
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Color</Label>
                    <Input
                      id="edit-color"
                      type="color"
                      value={editData.color}
                      onChange={(e) => setEditData(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-privacy">Privacy</Label>
                    <Select
                      id="edit-privacy"
                      value={editData.is_public ? 'true' : 'false'}
                      onValueChange={(value) => setEditData(prev => ({ ...prev, is_public: value === 'true' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Private</SelectItem>
                        <SelectItem value="true">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateDeck} disabled={isUpdating}>
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <CardTitle className="text-2xl mb-2">{deck.title}</CardTitle>
                  <CardDescription className="text-base">
                    {deck.description || 'No description'}
                  </CardDescription>
                </div>
              )}
            </div>
            
            {!isEditing && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Deck
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => importFlashcards(true)}>
                    <Import className="h-4 w-4 mr-2" />
                    Import Flashcards
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDeleteDeck} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Deck
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {!isEditing && (
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {deck.flashcard_count || 0} flashcards
                </span>
              </div>
              <Badge variant={deck.is_public ? "default" : "secondary"}>
                {deck.is_public ? (
                  <>
                    <Users className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Updated {formatDate(deck.updated_at)}
              </span>
            </div>
          )}
        </CardHeader>
        
        {!isEditing && (
          <CardContent>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/decks/${deckId}/study`}>
                  <Play className="h-4 w-4 mr-2" />
                  Study Deck
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setIsAddingCard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Flashcard
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Add New Flashcard */}
      {isAddingCard && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Flashcard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-front">Front</Label>
              <Textarea
                id="new-front"
                placeholder="Enter the question or prompt"
                value={newCardData.front}
                onChange={(e) => setNewCardData(prev => ({ ...prev, front: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-back">Back</Label>
              <Textarea
                id="new-back"
                placeholder="Enter the answer or explanation"
                value={newCardData.back}
                onChange={(e) => setNewCardData(prev => ({ ...prev, back: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddFlashcard} disabled={isAddingCardLoading}>
                {isAddingCardLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Flashcard
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingCard(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flashcards */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flashcards ({flashcards.filter(card => 
              searchQuery === '' || 
              card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
              card.back.toLowerCase().includes(searchQuery.toLowerCase())
            ).length})</CardTitle>
            {flashcards.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search flashcards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10"
                  />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {flashcards.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
              <p className="text-muted-foreground mb-6">
                Add your first flashcard to start building this study deck.
              </p>
              <Button onClick={() => setIsAddingCard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Flashcard
              </Button>
            </div>
          ) : (() => {
            const filteredCards = flashcards.filter(card => 
              searchQuery === '' || 
              card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
              card.back.toLowerCase().includes(searchQuery.toLowerCase())
            )
            
            if (filteredCards.length === 0) {
              return (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No flashcards found</h3>
                  <p className="text-muted-foreground mb-6">
                    No flashcards match your search &ldquo;{searchQuery}&rdquo;
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </div>
              )
            }
            
            return (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredCards.map((flashcard) => {
                const isFlipped = flippedCards.has(flashcard.id)
                const isEditing = editingCardId === flashcard.id
                
                if (isEditing) {
                  return (
                    <Card key={flashcard.id} className="border-primary">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Edit Flashcard</h4>
                            <div className="flex items-center gap-2">
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
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`edit-front-${flashcard.id}`}>Front</Label>
                            <Textarea
                              id={`edit-front-${flashcard.id}`}
                              value={editCardData.front}
                              onChange={(e) => setEditCardData(prev => ({ ...prev, front: e.target.value }))}
                              rows={2}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`edit-back-${flashcard.id}`}>Back</Label>
                            <Textarea
                              id={`edit-back-${flashcard.id}`}
                              value={editCardData.back}
                              onChange={(e) => setEditCardData(prev => ({ ...prev, back: e.target.value }))}
                              rows={2}
                            />
                          </div>
                          
                          <div className="flex gap-2 pt-2">
                            <Button onClick={handleUpdateFlashcard} disabled={isUpdatingCard} size="sm">
                              {isUpdatingCard ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-3 w-3 mr-2" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button variant="outline" onClick={handleCancelEditCard} size="sm">
                              <X className="h-3 w-3 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }
                
                return (
                  <Card 
                    key={flashcard.id} 
                    className="cursor-pointer hover:shadow-md transition-all duration-200 group p-0"
                    onClick={() => handleFlipCard(flashcard.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-2">
                          {flashcard.difficulty ? (
                            <Badge 
                              variant={
                                flashcard.difficulty === 'easy' ? 'secondary' :
                                flashcard.difficulty === 'medium' ? 'default' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {flashcard.difficulty}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No difficulty
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFlashcardStar(flashcard.id, !flashcard.is_starred)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            {flashcard.is_starred ? (
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarIcon className="h-3 w-3" />
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleStartEditCard(flashcard)
                              }}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFlashcard(flashcard.id)
                                }}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

                      <div className="flex items-center justify-between mt-5 pt-3 border-t text-xs text-muted-foreground">
                        <span>Created {formatDate(flashcard.created_at)}</span>
                        <span className="text-primary">Click to flip</span>
                      </div>
                    </CardContent>
                  </Card>
                )
                })}
              </div>
            )
          })()}
        </CardContent>
      </Card>
    </div>
  )
}