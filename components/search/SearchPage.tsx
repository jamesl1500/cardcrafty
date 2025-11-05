'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Clock, FileText, BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import SearchService, { SearchResult, SearchFilters, SearchOptions } from '@/lib/search-service'

interface SearchPageProps {
  initialQuery?: string
}

export default function SearchPage({ initialQuery = '' }: SearchPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  // Search filters
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    includeStarred: false
  })
  
  // Search options
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'alphabetical'>('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(SearchService.getRecentSearches())
  }, [])

  // Debounced search suggestions
  const debouncedGetSuggestions = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length >= 2) {
        try {
          const suggestions = await SearchService.getSearchSuggestions(searchQuery, 5)
          setSuggestions(suggestions)
        } catch (error) {
          console.error('Failed to get suggestions:', error)
        }
      } else {
        setSuggestions([])
      }
    },
    []
  )

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        debouncedGetSuggestions(query)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, debouncedGetSuggestions])

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, pageNum: number = 0, resetResults: boolean = true) => {
    if (!searchQuery.trim()) {
      setResults([])
      setTotal(0)
      setHasMore(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const options: SearchOptions = {
        limit: 20,
        offset: pageNum * 20,
        filters,
        sortBy,
        sortOrder
      }

      const response = await SearchService.search(searchQuery, options)
      
      if (resetResults) {
        setResults(response.results)
      } else {
        setResults(prev => [...prev, ...response.results])
      }
      
      setTotal(response.total)
      setHasMore(response.hasMore)
      setPage(pageNum)
      
      // Save to recent searches
      SearchService.saveRecentSearch(searchQuery)
      setRecentSearches(SearchService.getRecentSearches())
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, sortOrder])

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setShowSuggestions(false)
    performSearch(searchQuery, 0, true)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    router.push(`/search?${params.toString()}`)
  }

  // Load more results
  const loadMore = () => {
    if (hasMore && !loading) {
      performSearch(query, page + 1, false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    if (query) {
      performSearch(query, 0, true)
    }
  }

  // Handle sort changes
  const handleSortChange = (newSortBy: string, newSortOrder?: string) => {
    setSortBy(newSortBy as 'relevance' | 'date' | 'alphabetical')
    if (newSortOrder) setSortOrder(newSortOrder as 'asc' | 'desc')
    if (query) {
      performSearch(query, 0, true)
    }
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    SearchService.clearRecentSearches()
    setRecentSearches([])
  }

  // Navigate to result
  const navigateToResult = (result: SearchResult) => {
    if (result.type === 'deck') {
      router.push(`/decks/${result.id}`)
    } else if (result.type === 'flashcard' && result.deckId) {
      router.push(`/decks/${result.deckId}?highlight=${result.id}`)
    }
  }

  // Memoized filtered suggestions
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase() !== query.toLowerCase()
    )
  }, [suggestions, query])

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Search Header */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search decks and flashcards..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query)
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              className="pl-10 pr-4"
            />
            
            {/* Search suggestions dropdown */}
            {showSuggestions && (query || recentSearches.length > 0) && (
              <Card className="absolute top-full mt-1 w-full z-50 border shadow-lg">
                <CardContent className="p-2">
                  {/* Suggestions */}
                  {filteredSuggestions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                        Suggestions
                      </div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left"
                          onClick={() => handleSearch(suggestion)}
                        >
                          <Search className="h-3 w-3 mr-2" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <>
                      {filteredSuggestions.length > 0 && <Separator className="my-2" />}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-2 py-1">
                          <div className="text-xs font-medium text-muted-foreground">
                            Recent
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearRecentSearches}
                            className="h-auto p-1 text-xs"
                          >
                            Clear
                          </Button>
                        </div>
                        {recentSearches.slice(0, 5).map((recent, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => handleSearch(recent)}
                          >
                            <Clock className="h-3 w-3 mr-2" />
                            {recent}
                          </Button>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          <Button onClick={() => handleSearch(query)} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
          
          {/* Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Search Filters</SheetTitle>
                <SheetDescription>
                  Refine your search results
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Result Type */}
                <div className="space-y-2">
                  <Label>Result Type</Label>
                  <Select
                    value={filters.type || 'all'}
                    onValueChange={(value) => handleFilterChange({ type: value as 'deck' | 'flashcard' | 'all' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Results</SelectItem>
                      <SelectItem value="deck">Decks Only</SelectItem>
                      <SelectItem value="flashcard">Flashcards Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Include Starred */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="starred"
                    checked={filters.includeStarred || false}
                    onCheckedChange={(checked) => handleFilterChange({ includeStarred: checked })}
                  />
                  <Label htmlFor="starred">Starred items only</Label>
                </div>
                
                {/* Sort Options */}
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => handleSortChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => handleSortChange(sortBy, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Search Stats */}
        {query && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </span>
            {Object.values(filters).some(Boolean) && (
              <Badge variant="secondary" className="text-xs">
                Filtered
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-destructive mb-6">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={`${result.type}-${result.id}-${index}`} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateToResult(result)}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {result.type === 'deck' ? (
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  ) : (
                    <FileText className="h-6 w-6 text-green-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{result.title}</h3>
                        <Badge variant={result.type === 'deck' ? 'default' : 'secondary'} className="text-xs">
                          {result.type}
                        </Badge>
                        {result.match_type && (
                          <Badge variant="outline" className="text-xs">
                            {result.match_type}
                          </Badge>
                        )}
                      </div>
                      
                      {result.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {result.description}
                        </p>
                      )}
                      
                      {result.deckTitle && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>from {result.deckTitle}</span>
                        </div>
                      )}
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
        
        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No results found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Empty State */}
        {!query && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Search your decks and flashcards</h3>
              <p className="text-sm text-muted-foreground">
                Enter a search term to find decks, flashcards, and study materials
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}