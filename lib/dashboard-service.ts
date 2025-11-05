import { supabase } from './supabase'
import type { Deck, Flashcard, DashboardData } from './types'

export class DashboardService {
  
  /**
   * Get the current authenticated user
   * 
   * @returns The user object or null if not authenticated
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error)
        return null
      }
      return user
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  /**
   * Fetch all decks for the current user
   * 
   * @returns An array of Deck objects
   */
  static async getUserDecks(): Promise<Deck[]> {
    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('decks')
      .select(`
        *,
        flashcards(count)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching user decks:', error)
      return []
    }

    // Map the response to include flashcard count
    return (data || []).map(deck => ({
      ...deck,
      flashcard_count: deck.flashcards?.[0]?.count || 0
    }))
  }

    /**
   * Fetch flashcards that are not attached to any deck
   * 
   * @returns An array of unattached Flashcard objects
   */
  static async getUnattachedFlashcards(): Promise<Flashcard[]> {
    const user = await this.getCurrentUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', user.id)
      .is('deck_id', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching unattached flashcards:', error)
      return []
    }

    return data || []
  }

  /**
   * Get dashboard statistics
   * 
   * @returns An object containing dashboard statistics
   */
  static async getDashboardStats() {
    const user = await this.getCurrentUser()
    if (!user) {
      return {
        totalDecks: 0,
        totalFlashcards: 0,
        studyStreak: 0,
        totalStudyTime: 0,
        averageScore: 0,
        level: 1,
        xp: 0,
        nextLevelXp: 100
      }
    }

    // Get total decks count
    const { count: totalDecks } = await supabase
      .from('decks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get total flashcards count
    const { count: totalFlashcards } = await supabase
      .from('flashcards')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Get recent study sessions for streak calculation
    const { data: recentSessions } = await supabase
      .from('study_sessions')
      .select('completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(30)

    // Calculate study streak (simplified - consecutive days)
    let studyStreak = 0
    if (recentSessions && recentSessions.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const dates = recentSessions.map(session => {
        const date = new Date(session.completed_at)
        date.setHours(0, 0, 0, 0)
        return date.getTime()
      })
      
      const uniqueDates = [...new Set(dates)].sort((a, b) => b - a)
      
      for (let i = 0; i < uniqueDates.length; i++) {
        const expectedDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000))
        if (uniqueDates[i] === expectedDate.getTime()) {
          studyStreak++
        } else {
          break
        }
      }
    }

    // Get total study time (in minutes)
    const { data: totalTimeData } = await supabase
      .from('study_sessions')
      .select('duration_seconds')
      .eq('user_id', user.id)

    const totalStudyTime = totalTimeData?.reduce((sum, session) => 
      sum + (session.duration_seconds || 0), 0) || 0

    return {
      totalDecks: totalDecks || 0,
      totalFlashcards: totalFlashcards || 0,
      studyStreak,
      totalStudyTime: Math.round(totalStudyTime / 60) // Convert to minutes
    }
  }

  /**
   * Get complete dashboard data
   * 
   * @returns An object containing decks, unattached flashcards, recent activity, and stats
   */
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const [decks, unattachedFlashcards, stats] = await Promise.all([
        this.getUserDecks(),
        this.getUnattachedFlashcards(),
        this.getDashboardStats()
      ])

      return {
        decks,
        unattachedFlashcards,
        recentActivity: [], // TODO: Implement recent activity
        stats
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }

  /**
   * Create a new deck
   * 
   * @param deckData - The data for the new deck
   * @returns The created Deck object
   */
  static async createDeck(deckData: { title: string; description?: string; is_public?: boolean; color?: string }) {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('decks')
      .insert({
        ...deckData,
        user_id: user.id,
        is_public: deckData.is_public || false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Create a new flashcard
   * 
   * @param flashcardData - The data for the new flashcard
   * @returns The created Flashcard object
   */
  static async createFlashcard(flashcardData: { front: string; back: string; deck_id?: string }) {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        ...flashcardData,
        user_id: user.id,
        is_starred: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}