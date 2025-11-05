import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

/**
 * StudySettings
 * 
 * Interface representing the settings for a study session
 */
export interface StudySettings {
  showProgress?: boolean
  autoFlip?: boolean
  shuffleCards?: boolean
  studyStarredOnly?: boolean
  studyMode?: 'flashcards' | 'quiz' | 'match'
  timeLimit?: number
  [key: string]: unknown
}

/**
 * StudyService
 * 
 * Service class for managing study sessions and related operations
 */
export interface StudySessionData {
  id?: string
  user_id?: string
  deck_id: string
  started_at?: string
  completed_at?: string | null
  total_cards: number
  cards_studied: number
  correct_answers: number
  incorrect_answers: number
  accuracy?: number
  duration_seconds?: number
  study_mode?: string
  settings?: StudySettings
}

/**
 * StudySessionAnswer
 * 
 * Interface representing an answer given during a study session
 */
export interface StudySessionAnswer {
  id?: string
  session_id: string
  flashcard_id: string
  answer: 'correct' | 'incorrect' | 'skipped'
  response_time_ms?: number
  attempt_number?: number
  answered_at?: string
}

/**
 * StudySessionWithAnswers
 * 
 * Interface representing a study session along with its answers
 */
export interface StudySessionWithAnswers extends StudySessionData {
  answers?: StudySessionAnswer[]
}

/**
 * StudyAnalytics
 * 
 * Interface representing comprehensive study analytics for a user
 */
export interface StudyAnalytics {
  totalSessions: number
  totalStudyTime: number
  averageAccuracy: number
  cardsStudied: number
  favoriteDecks: Array<{
    deck_id: string
    deck_title: string
    session_count: number
  }>
  studyStreak: number
  recentSessions: StudySessionData[]
  performanceByDeck: Array<{
    deck_id: string
    deck_title: string
    accuracy: number
    sessions: number
    total_cards: number
  }>
}

/**
 * StudyService
 * 
 * Service class for managing study sessions and related operations
 */
export class StudyService {
  
  /**
   * getCurrentUser
   * 
   * Get the currently authenticated user
   * 
   * @returns A promise that resolves to the user object or null if not authenticated
   */
  static async getCurrentUser(): Promise<User> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error('User not authenticated')
    return user
  }

  /**
   * startStudySession
   * 
   * Start a new study session
   * 
   * @param data - An object containing the study session data
   * @returns A promise that resolves to the created StudySessionData object
   */
  static async startStudySession(data: {
    deck_id: string
    total_cards: number
    study_mode?: string
    settings?: StudySettings
  }): Promise<StudySessionData> {
    const user = await this.getCurrentUser()

    const sessionData = {
      user_id: user.id,
      deck_id: data.deck_id,
      total_cards: data.total_cards,
      cards_studied: 0,
      correct_answers: 0,
      incorrect_answers: 0,
      study_mode: data.study_mode || 'flashcards',
      settings: data.settings || {},
      started_at: new Date().toISOString()
    }

    const { data: session, error } = await supabase
      .from('study_sessions')
      .insert([sessionData])
      .select()
      .single()

    if (error) throw error
    return session
  }

  /**
   * updateStudySession
   * 
   * Update study session progress
   * 
   * @param sessionId - The ID of the study session to update
   * @param updates - An object containing the fields to update
   * @returns A promise that resolves to the updated StudySessionData object
   */
  static async updateStudySession(
    sessionId: string, 
    updates: Partial<StudySessionData>
  ): Promise<StudySessionData> {
    const user = await this.getCurrentUser()

    // Calculate accuracy if correct/incorrect answers are provided
    const updateData = { ...updates }
    if (updates.correct_answers !== undefined && updates.incorrect_answers !== undefined) {
      const total = updates.correct_answers + updates.incorrect_answers
      updateData.accuracy = total > 0 ? Math.round((updates.correct_answers / total) * 100) : 0
    }

    const { data: session, error } = await supabase
      .from('study_sessions')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return session
  }

  /**
   * completeStudySession
   * 
   * Complete a study session
   * 
   * @param sessionId - The ID of the study session to complete
   * @param finalData - An object containing the final study session data
   * @returns A promise that resolves to the completed StudySessionData object
   */
  static async completeStudySession(
    sessionId: string,
    finalData: {
      cards_studied: number
      correct_answers: number
      incorrect_answers: number
      duration_seconds?: number
    }
  ): Promise<StudySessionData> {
    const accuracy = finalData.correct_answers + finalData.incorrect_answers > 0
      ? Math.round((finalData.correct_answers / (finalData.correct_answers + finalData.incorrect_answers)) * 100)
      : 0

    return this.updateStudySession(sessionId, {
      ...finalData,
      accuracy,
      completed_at: new Date().toISOString()
    })
  }

  /**
   * recordAnswer
   * 
   * Record an answer for a flashcard during a study session
   * 
   * @param data - An object containing the answer data
   * @returns A promise that resolves to the created StudySessionAnswer object
   */
  static async recordAnswer(data: {
    session_id: string
    flashcard_id: string
    answer: 'correct' | 'incorrect' | 'skipped'
    response_time_ms?: number
    attempt_number?: number
  }): Promise<StudySessionAnswer> {
    const answerData = {
      ...data,
      answered_at: new Date().toISOString()
    }

    const { data: answer, error } = await supabase
      .from('study_session_answers')
      .insert([answerData])
      .select()
      .single()

    if (error) throw error
    return answer
  }

  /**
   * getStudySession
   * 
   * Get a specific study session along with its answers
   * 
   * @param sessionId - The ID of the study session
   * @returns A promise that resolves to the StudySessionWithAnswers object or null if not found
   */
  static async getStudySession(sessionId: string): Promise<StudySessionWithAnswers | null> {
    const user = await this.getCurrentUser()

    const { data: session, error } = await supabase
      .from('study_sessions')
      .select(`
        *,
        study_session_answers (*)
      `)
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return {
      ...session,
      answers: session.study_session_answers || []
    }
  }

  /**
   * getUserStudySessions
   * 
   * Get user's study sessions
   * 
   * @param limit - Number of sessions to retrieve
   * @param offset - Offset for pagination
   * @returns A promise that resolves to an array of StudySessionData objects
   */
  static async getUserStudySessions(
    limit = 50,
    offset = 0
  ): Promise<StudySessionData[]> {
    const user = await this.getCurrentUser()

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select(`
        *,
        decks!inner (
          id,
          title,
          color
        )
      `)
      .eq('user_id', user.id)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return sessions || []
  }

  /**
   * getDeckStudySessions
   * 
   * Get study sessions for a specific deck
   * 
   * @param deckId - The ID of the deck
   * @returns A promise that resolves to an array of StudySessionData objects
   */
  static async getDeckStudySessions(deckId: string): Promise<StudySessionData[]> {
    const user = await this.getCurrentUser()

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('deck_id', deckId)
      .order('started_at', { ascending: false })

    if (error) throw error
    return sessions || []
  }

  /**
   * getStudyAnalytics
   * 
   * Get comprehensive study analytics for the user
   * 
   * @param dateRange - Optional date range to filter sessions
   * @returns A promise that resolves to the StudyAnalytics object
   */
  static async getStudyAnalytics(
    dateRange?: { start: string; end: string }
  ): Promise<StudyAnalytics> {
    const user = await this.getCurrentUser()

    let query = supabase
      .from('study_sessions')
      .select(`
        *,
        decks!inner (
          id,
          title,
          color
        )
      `)
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)

    if (dateRange) {
      query = query
        .gte('started_at', dateRange.start)
        .lte('started_at', dateRange.end)
    }

    const { data: sessions, error } = await query.order('started_at', { ascending: false })

    if (error) throw error

    const sessionsData = sessions || []

    // Calculate analytics
    const totalSessions = sessionsData.length
    const totalStudyTime = sessionsData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0)
    const averageAccuracy = sessionsData.length > 0
      ? sessionsData.reduce((sum, s) => sum + (s.accuracy || 0), 0) / sessionsData.length
      : 0
    const cardsStudied = sessionsData.reduce((sum, s) => sum + s.cards_studied, 0)

    // Favorite decks
    const deckCounts: Record<string, { count: number; title: string }> = {}
    sessionsData.forEach(session => {
      const deckId = session.deck_id
      const deckTitle = session.decks?.title || 'Unknown Deck'
      if (!deckCounts[deckId]) {
        deckCounts[deckId] = { count: 0, title: deckTitle }
      }
      deckCounts[deckId].count++
    })

    const favoriteDecks = Object.entries(deckCounts)
      .map(([deck_id, data]) => ({
        deck_id,
        deck_title: data.title,
        session_count: data.count
      }))
      .sort((a, b) => b.session_count - a.session_count)
      .slice(0, 5)

    // Study streak calculation (simplified)
    const studyStreak = await this.calculateStudyStreak()

    // Performance by deck
    const deckPerformance: Record<string, {
      total_accuracy: number
      sessions: number
      total_cards: number
      title: string
    }> = {}

    sessionsData.forEach(session => {
      const deckId = session.deck_id
      if (!deckPerformance[deckId]) {
        deckPerformance[deckId] = {
          total_accuracy: 0,
          sessions: 0,
          total_cards: 0,
          title: session.decks?.title || 'Unknown Deck'
        }
      }
      deckPerformance[deckId].total_accuracy += session.accuracy || 0
      deckPerformance[deckId].sessions++
      deckPerformance[deckId].total_cards += session.cards_studied
    })

    const performanceByDeck = Object.entries(deckPerformance)
      .map(([deck_id, data]) => ({
        deck_id,
        deck_title: data.title,
        accuracy: data.sessions > 0 ? Math.round(data.total_accuracy / data.sessions) : 0,
        sessions: data.sessions,
        total_cards: data.total_cards
      }))
      .sort((a, b) => b.sessions - a.sessions)

    return {
      totalSessions,
      totalStudyTime,
      averageAccuracy: Math.round(averageAccuracy),
      cardsStudied,
      favoriteDecks,
      studyStreak,
      recentSessions: sessionsData.slice(0, 10),
      performanceByDeck
    }
  }

  /**
   * calculateStudyStreak
   * 
   * Calculate the user's current study streak
   * 
   * @returns A promise that resolves to the number of consecutive days studied
   */
  static async calculateStudyStreak(): Promise<number> {
    const user = await this.getCurrentUser()

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('started_at')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('started_at', { ascending: false })

    if (error) throw error

    if (!sessions || sessions.length === 0) return 0

    // Group sessions by date
    const sessionDates = sessions.map(s => 
      new Date(s.started_at).toDateString()
    )
    const uniqueDates = [...new Set(sessionDates)]

    // Calculate consecutive days
    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    // Check if user studied today or yesterday
    if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
      streak = 1
      
      // Count consecutive days going backwards
      for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i])
        const previousDate = new Date(uniqueDates[i - 1])
        const dayDiff = Math.floor((previousDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))
        
        if (dayDiff === 1) {
          streak++
        } else {
          break
        }
      }
    }

    return streak
  }

  /**
   * getStudyStats
   * 
   * Get summarized study statistics for a given period
   * 
   * @param period - The time period to summarize ('week', 'month', 'year')
   * @returns A promise that resolves to an object containing study statistics
   */
  static async getStudyStats(
    period: 'week' | 'month' | 'year' = 'week'
  ): Promise<{
    sessions: number
    studyTime: number
    accuracy: number
    cardsStudied: number
    improvement: number
  }> {
    const user = await this.getCurrentUser()

    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .gte('started_at', startDate.toISOString())

    if (error) throw error

    const sessionsData = sessions || []
    const sessionCount = sessionsData.length
    const studyTime = sessionsData.reduce((sum, s) => sum + (s.duration_seconds || 0), 0)
    const accuracy = sessionsData.length > 0
      ? sessionsData.reduce((sum, s) => sum + (s.accuracy || 0), 0) / sessionsData.length
      : 0
    const cardsStudied = sessionsData.reduce((sum, s) => sum + s.cards_studied, 0)

    // Calculate improvement (compare to previous period)
    const previousStart = new Date(startDate)
    previousStart.setTime(previousStart.getTime() - (now.getTime() - startDate.getTime()))

    const { data: previousSessions } = await supabase
      .from('study_sessions')
      .select('accuracy')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .gte('started_at', previousStart.toISOString())
      .lt('started_at', startDate.toISOString())

    const previousAccuracy = previousSessions && previousSessions.length > 0
      ? previousSessions.reduce((sum, s) => sum + (s.accuracy || 0), 0) / previousSessions.length
      : 0

    const improvement = previousAccuracy > 0 ? accuracy - previousAccuracy : 0

    return {
      sessions: sessionCount,
      studyTime,
      accuracy: Math.round(accuracy),
      cardsStudied,
      improvement: Math.round(improvement)
    }
  }
}