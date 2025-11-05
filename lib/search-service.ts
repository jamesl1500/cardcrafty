/**
 * SearchService
 * 
 * Provides search functionality across decks and flashcards.
 * Uses Supabase as the backend database.
 * 
 * Features:
 * - Full-text search on deck titles/descriptions and flashcard terms/definitions.
 * - Filtering by deck, starred status, and date range.
 * - Sorting by relevance, date, or alphabetical order.
 * - Search suggestions based on user's data.
 * - Recent searches stored in local storage.
 * 
 * @module lib/search-service
 */
import { supabase } from './supabase'

/**
 * SearchResult
 * 
 * Represents a single search result item.
 */
export interface SearchResult {
  type: 'deck' | 'flashcard'
  id: string
  title: string
  description?: string
  deckId?: string
  deckTitle?: string
  match_type: 'title' | 'description' | 'front' | 'back'
  relevance_score: number
}

/**
 * SearchFilters
 * 
 * Filters that can be applied to search queries.
 */
export interface SearchFilters {
  type?: 'deck' | 'flashcard' | 'all'
  deckIds?: string[]
  includeStarred?: boolean
  dateFrom?: string
  dateTo?: string
}

/**
 * SearchOptions
 * 
 * Options for configuring search behavior.
 */
export interface SearchOptions {
  limit?: number
  offset?: number
  filters?: SearchFilters
  sortBy?: 'relevance' | 'date' | 'alphabetical'
  sortOrder?: 'asc' | 'desc'
}

/**
 * SearchService
 * 
 * Provides methods to perform searches and manage search-related data.
 */
class SearchService {
  /**
   * Search across decks and flashcards
   * 
   * @param query - The search query string
   * @param options - Search options (filters, sorting, pagination)
   * @returns Promise resolving to search results and metadata
   */
  async search(
    query: string, 
    options: SearchOptions = {}
  ): Promise<{ results: SearchResult[], total: number, hasMore: boolean }> {
    if (!query.trim()) {
      return { results: [], total: 0, hasMore: false }
    }

    const {
      limit = 20,
      offset = 0,
      filters = {},
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = options

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const results: SearchResult[] = []

      // Search decks if not filtered to flashcards only
      if (filters.type !== 'flashcard') {
        const deckResults = await this.searchDecks(query, user.id, filters)
        results.push(...deckResults)
      }

      // Search flashcards if not filtered to decks only
      if (filters.type !== 'deck') {
        const flashcardResults = await this.searchFlashcards(query, user.id, filters)
        results.push(...flashcardResults)
      }

      // Sort results
      const sortedResults = this.sortResults(results, sortBy, sortOrder)

      // Apply pagination
      const paginatedResults = sortedResults.slice(offset, offset + limit)
      const hasMore = sortedResults.length > offset + limit

      return {
        results: paginatedResults,
        total: sortedResults.length,
        hasMore
      }
    } catch (error) {
      console.error('Search error:', error)
      throw new Error('Failed to search')
    }
  }

  /**
   * Search decks by title and description
   * 
   * @param query - The search query string
   * @param userId - The ID of the user performing the search
   * @param filters - Additional search filters
   * @returns Promise resolving to an array of SearchResult
   */
  private async searchDecks(
    query: string, 
    userId: string, 
    filters: SearchFilters
  ): Promise<SearchResult[]> {
    let deckQuery = supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)

    // Apply date filters
    if (filters.dateFrom) {
      deckQuery = deckQuery.gte('created_at', filters.dateFrom)
    }
    if (filters.dateTo) {
      deckQuery = deckQuery.lte('created_at', filters.dateTo)
    }

    // Apply deck ID filter
    if (filters.deckIds && filters.deckIds.length > 0) {
      deckQuery = deckQuery.in('id', filters.deckIds)
    }

    const { data: decks, error } = await deckQuery

    if (error) throw error

    const results: SearchResult[] = []
    const searchTerm = query.toLowerCase()

    for (const deck of decks || []) {
      const titleMatch = deck.title.toLowerCase().includes(searchTerm)
      const descriptionMatch = deck.description?.toLowerCase().includes(searchTerm)

      if (titleMatch || descriptionMatch) {
        // Calculate relevance score
        let relevanceScore = 0
        
        if (titleMatch) {
          relevanceScore += 10
          if (deck.title.toLowerCase().startsWith(searchTerm)) {
            relevanceScore += 5
          }
        }
        
        if (descriptionMatch) {
          relevanceScore += 5
        }

        results.push({
          type: 'deck',
          id: deck.id,
          title: deck.title,
          description: deck.description,
          match_type: titleMatch ? 'title' : 'description',
          relevance_score: relevanceScore
        })
      }
    }

    return results
  }

  /**
   * Search flashcards by term and definition
   * 
   * @param query - The search query string
   * @param userId - The ID of the user performing the search
   * @param filters - Additional search filters
   * @returns Promise resolving to an array of SearchResult
   */
  private async searchFlashcards(
    query: string, 
    userId: string, 
    filters: SearchFilters
  ): Promise<SearchResult[]> {
    // First get user's decks to filter flashcards
    let deckQuery = supabase
      .from('decks')
      .select('id, title')
      .eq('user_id', userId)

    if (filters.deckIds && filters.deckIds.length > 0) {
      deckQuery = deckQuery.in('id', filters.deckIds)
    }

    const { data: userDecks, error: deckError } = await deckQuery
    if (deckError) throw deckError

    if (!userDecks || userDecks.length === 0) {
      return []
    }

    const deckIds = userDecks.map(deck => deck.id)
    const deckTitleMap = new Map(userDecks.map(deck => [deck.id, deck.title]))

    // Search flashcards
    let flashcardQuery = supabase
      .from('flashcards')
      .select('*')
      .in('deck_id', deckIds)

    // Apply date filters
    if (filters.dateFrom) {
      flashcardQuery = flashcardQuery.gte('created_at', filters.dateFrom)
    }
    if (filters.dateTo) {
      flashcardQuery = flashcardQuery.lte('created_at', filters.dateTo)
    }

    // Apply starred filter
    if (filters.includeStarred === true) {
      flashcardQuery = flashcardQuery.eq('is_starred', true)
    }

    const { data: flashcards, error: flashcardError } = await flashcardQuery

    if (flashcardError) throw flashcardError

    const results: SearchResult[] = []
    const searchTerm = query.toLowerCase()

    for (const flashcard of flashcards || []) {
      const termMatch = flashcard.term.toLowerCase().includes(searchTerm)
      const definitionMatch = flashcard.definition.toLowerCase().includes(searchTerm)

      if (termMatch || definitionMatch) {
        // Calculate relevance score
        let relevanceScore = 0
        
        if (termMatch) {
          relevanceScore += 8
          if (flashcard.term.toLowerCase().startsWith(searchTerm)) {
            relevanceScore += 4
          }
        }
        
        if (definitionMatch) {
          relevanceScore += 6
        }

        // Boost score for starred cards
        if (flashcard.is_starred) {
          relevanceScore += 2
        }

        results.push({
          type: 'flashcard',
          id: flashcard.id,
          title: flashcard.term,
          description: flashcard.definition,
          deckId: flashcard.deck_id,
          deckTitle: deckTitleMap.get(flashcard.deck_id),
          match_type: termMatch ? 'front' : 'back',
          relevance_score: relevanceScore
        })
      }
    }

    return results
  }

  /**
   * Sort search results
   * 
   * @param results - Array of SearchResult to sort
   * @param sortBy - Field to sort by
   * @param sortOrder - 'asc' or 'desc'
   * @returns Sorted array of SearchResult
   */
  private sortResults(
    results: SearchResult[], 
    sortBy: string, 
    sortOrder: string
  ): SearchResult[] {
    return results.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'relevance':
          comparison = b.relevance_score - a.relevance_score
          break
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          comparison = b.relevance_score - a.relevance_score
          break
        default:
          comparison = b.relevance_score - a.relevance_score
      }

      return sortOrder === 'desc' ? comparison : -comparison
    })
  }

  /**
   * Get search suggestions based on user's decks and flashcards
   * 
   * @param query - The partial search query string
   * @param limit - Maximum number of suggestions to return
   * @returns Promise resolving to an array of suggestion strings
   */
  async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    if (!query.trim() || query.length < 2) {
      return []
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const searchTerm = query.toLowerCase()
      const suggestions = new Set<string>()

      // Get deck titles
      const { data: decks } = await supabase
        .from('decks')
        .select('title')
        .eq('user_id', user.id)
        .ilike('title', `%${query}%`)
        .limit(limit)

      decks?.forEach(deck => {
        if (deck.title.toLowerCase().includes(searchTerm)) {
          suggestions.add(deck.title)
        }
      })

      // Get flashcard terms
      const userDecksResult = await supabase
        .from('decks')
        .select('id')
        .eq('user_id', user.id)

      if (userDecksResult.data) {
        const deckIds = userDecksResult.data.map(d => d.id)
        
        const { data: flashcards } = await supabase
          .from('flashcards')
          .select('front')
          .in('deck_id', deckIds)
          .ilike('front', `%${query}%`)
          .limit(limit)

        flashcards?.forEach(flashcard => {
          if (flashcard.front.toLowerCase().includes(searchTerm)) {
            suggestions.add(flashcard.front)
          }
        })
      }

      return Array.from(suggestions).slice(0, limit)
    } catch (error) {
      console.error('Error getting search suggestions:', error)
      return []
    }
  }

  /**
   * Get recent searches (client-side storage)
   * 
   * @returns Array of recent search strings
   */
  getRecentSearches(): string[] {
    try {
      const recent = localStorage.getItem('quizlet_recent_searches')
      return recent ? JSON.parse(recent) : []
    } catch {
      return []
    }
  }

  /**
   * Save recent search (client-side storage)
   * 
   * @param query - The search query string to save
   */
  saveRecentSearch(query: string): void {
    try {
      const recent = this.getRecentSearches()
      const updated = [query, ...recent.filter(q => q !== query)].slice(0, 10)
      localStorage.setItem('quizlet_recent_searches', JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving recent search:', error)
    }
  }

  /**
   * Clear recent searches
   * Removes all recent searches from client-side storage
   * 
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem('quizlet_recent_searches')
    } catch (error) {
      console.error('Error clearing recent searches:', error)
    }
  }
}

/**
 * Export a singleton instance of SearchService
 * 
 * @exports {SearchService} The SearchService instance
 */
const searchService = new SearchService()
export default searchService