'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Command, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SearchService, { SearchResult } from '@/lib/search-service'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(false)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Debounced search
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length >= 2) {
        setLoading(true)
        try {
          const response = await SearchService.search(searchQuery, { limit: 10 })
          setResults(response.results)
          setSelectedIndex(0)
        } catch (error) {
          console.error('Search failed:', error)
          setResults([])
        } finally {
          setLoading(false)
        }
      } else {
        setResults([])
      }
    },
    []
  )

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        debouncedSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, debouncedSearch])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + Math.max(1, results.length)) % Math.max(1, results.length))
          break
        case 'Enter':
          e.preventDefault()
          if (results.length > 0) {
            handleSelect(results[selectedIndex])
          } else if (query.trim()) {
            handleFullSearch()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, query, onClose])

  // Handle result selection
  const handleSelect = useCallback((result: SearchResult) => {
    SearchService.saveRecentSearch(query)
    
    if (result.type === 'deck') {
      router.push(`/decks/${result.id}`)
    } else if (result.type === 'flashcard' && result.deckId) {
      router.push(`/decks/${result.deckId}?highlight=${result.id}`)
    }
    
    onClose()
  }, [query, router, onClose])

  // Handle full search
  const handleFullSearch = useCallback(() => {
    if (query.trim()) {
      SearchService.saveRecentSearch(query)
      router.push(`/search?q=${encodeURIComponent(query)}`)
      onClose()
    }
  }, [query, router, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Quick Search
          </DialogTitle>
          <DialogDescription>
            Search your decks and flashcards quickly
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search decks and flashcards..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="pl-10"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="px-6 py-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="px-2 pb-2">
              {results.map((result, index) => (
                <Button
                  key={`${result.type}-${result.id}-${index}`}
                  variant={index === selectedIndex ? "secondary" : "ghost"}
                  className="w-full justify-start text-left p-3 h-auto mb-1"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0">
                      {result.type === 'deck' ? (
                        <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          D
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium">
                          F
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{result.title}</div>
                      {result.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {result.description}
                        </div>
                      )}
                      {result.deckTitle && (
                        <div className="text-xs text-muted-foreground">
                          from {result.deckTitle}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-6 py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No decks or flashcards match your search
              </p>
              <Button onClick={handleFullSearch} variant="outline">
                Search all results
              </Button>
            </div>
          )}

          {!query && (
            <div className="px-6 py-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quick Search</h3>
              <p className="text-sm text-muted-foreground">
                Start typing to search your decks and flashcards
              </p>
            </div>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="px-6 py-3 border-t bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            {query && (
              <span>Press Enter to search all results</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for global command palette
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k' && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }
}