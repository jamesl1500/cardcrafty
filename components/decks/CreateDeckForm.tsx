"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import { DeckService } from '@/lib/deck-service'
import type { CreateDeckData } from '@/lib/types'

const DECK_COLORS = [
  { name: 'Red', value: '#ff6b6b' },
  { name: 'Orange', value: '#ffa726' },
  { name: 'Yellow', value: '#ffee58' },
  { name: 'Green', value: '#66bb6a' },
  { name: 'Blue', value: '#42a5f5' },
  { name: 'Purple', value: '#ab47bc' },
  { name: 'Pink', value: '#ec407a' },
  { name: 'Teal', value: '#26a69a' },
]

export default function CreateDeckForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const [formData, setFormData] = useState<CreateDeckData>({
    title: '',
    description: '',
    is_public: false,
    color: DECK_COLORS[0].value
  })

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deck title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Deck title must be at least 3 characters'
    }
    
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    try {
      const newDeck = await DeckService.createDeck(formData)
      router.push(`/decks/${newDeck.id}`)
    } catch (error) {
      console.error('Error creating deck:', error)
      setErrors({ submit: 'Failed to create deck. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateDeckData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Deck</h1>
          <p className="text-muted-foreground">
            Organize your flashcards into a study deck
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deck Details</CardTitle>
          <CardDescription>
            Set up your new study deck with a title, description, and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Deck Title *</Label>
              <Input
                id="title"
                placeholder="Enter deck title (e.g., Spanish Vocabulary)"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this deck is about (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={errors.description ? 'border-red-500' : ''}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description?.length || 0}/500 characters
              </p>
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Deck Color</Label>
              <div className="grid grid-cols-4 gap-3">
                {DECK_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleInputChange('color', color.value)}
                    className={`
                      flex items-center justify-center h-12 rounded-lg border-2 transition-all
                      ${formData.color === color.value 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    style={{ backgroundColor: color.value }}
                  >
                    <span className="text-white text-xs font-medium drop-shadow">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Public/Private Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Make deck public</Label>
                <p className="text-sm text-muted-foreground">
                  Other users will be able to view and study this deck
                </p>
              </div>
              <Switch
                id="public"
                checked={formData.is_public}
                onCheckedChange={(checked) => handleInputChange('is_public', checked)}
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                {errors.submit}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-6">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Deck
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}