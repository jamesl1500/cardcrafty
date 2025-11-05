'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SearchService, { SearchResult } from '@/lib/search-service'

interface SearchWidgetProps {
  placeholder?: string
  showRecent?: boolean
  autoFocus?: boolean
  onSelect?: (result: SearchResult) => void
  className?: string
}

export default function SearchWidget({
  placeholder = "Search decks and flashcards...",
  showRecent = true,
  autoFocus = false,
  onSelect,
  className
}: SearchWidgetProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  // Load recent searches on mount
  useEffect(() => {
    if (showRecent) {
      setRecentSearches(SearchService.getRecentSearches())
    }
  }, [showRecent])

  // Debounced search
  const debouncedSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length >= 2) {
        setLoading(true)
        try {
          const response = await SearchService.search(searchQuery, { limit: 5 })
          setResults(response.results)
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

  // Show dropdown when input is focused and there's content
  useEffect(() => {
    setShowDropdown(isInputFocused && (!!query || (showRecent && recentSearches.length > 0)))
  }, [isInputFocused, query, showRecent, recentSearches.length])

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result)
    } else {
      // Default navigation behavior
      if (result.type === 'deck') {
        router.push(`/decks/${result.id}`)
      } else if (result.type === 'flashcard' && result.deckId) {
        router.push(`/decks/${result.deckId}?highlight=${result.id}`)
      }
    }
    
    // Save search and reset
    SearchService.saveRecentSearch(query)
    setRecentSearches(SearchService.getRecentSearches())
    setQuery('')
    setShowDropdown(false)
  }

  // Handle recent search selection
  const handleRecentSelect = (recentQuery: string) => {
    setQuery(recentQuery)
    router.push(`/search?q=${encodeURIComponent(recentQuery)}`)
    setShowDropdown(false)
  }

  // Handle full search
  const handleFullSearch = () => {
    if (query.trim()) {
      SearchService.saveRecentSearch(query)
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowDropdown(false)
    }
  }

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        handleSelect(results[0])
      } else {
        handleFullSearch()
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setQuery('')
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => {
            // Delay hiding dropdown to allow clicking
            setTimeout(() => setIsInputFocused(false), 200)
          }}
          autoFocus={autoFocus}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            ×
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <Card className="absolute top-full mt-1 w-full z-50 border shadow-lg max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {/* Search Results */}
            {results.length > 0 && (
              <div className="space-y-1 mb-2">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Results
                </div>
                {results.map((result, index) => (
                  <Button
                    key={`${result.type}-${result.id}-${index}`}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left p-2 h-auto"
                    onClick={() => handleSelect(result)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-shrink-0">
                        {result.type === 'deck' ? (
                          <div className="h-6 w-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium">
                            D
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">
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
                      <Badge variant="outline" className="text-xs">
                        {result.type}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {/* Recent Searches */}
            {showRecent && recentSearches.length > 0 && (
              <div className="space-y-1">
                {results.length > 0 && <div className="border-t my-2" />}
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="text-xs font-medium text-muted-foreground">
                    Recent
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      SearchService.clearRecentSearches()
                      setRecentSearches([])
                    }}
                    className="h-auto p-1 text-xs"
                  >
                    Clear
                  </Button>
                </div>
                {recentSearches.slice(0, 3).map((recent, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => handleRecentSelect(recent)}
                  >
                    <Clock className="h-3 w-3 mr-2" />
                    {recent}
                  </Button>
                ))}
              </div>
            )}

            {/* View All Results */}
            {query && (
              <>
                {(results.length > 0 || recentSearches.length > 0) && (
                  <div className="border-t my-2" />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={handleFullSearch}
                >
                  <Search className="h-3 w-3 mr-2" />
                  Search for &ldquo;{query}&rdquo;
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}