/**
 * types
 * 
 * This file contains TypeScript interfaces and types used across the application.
 * It defines the structure of data entities such as User, Deck, Flashcard, and StudySession.
 * 
 * Interfaces:
 * - User: Represents a user in the system.
 * - Deck: Represents a collection of flashcards.
 * - Flashcard: Represents an individual flashcard.
 * - StudySession: Represents a study session for tracking user activity.
 * 
 * @module lib/types
 */

/**
 * User
 * 
 * Represents a user in the system.
 */
export interface User {
  id: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

/**
 * Deck
 * 
 * Represents a collection of flashcards.
 */
export interface Deck {
  id: string
  title: string
  description?: string
  user_id: string
  is_public: boolean
  color?: string
  created_at: string
  updated_at: string
  flashcard_count?: number
}

/**
 * Flashcard
 * 
 * Represents an individual flashcard.
 */
export interface Flashcard {
  id: string
  front: string
  back: string
  deck_id?: string | null  // Optional - can be null for flashcards not in a deck
  user_id: string
  is_starred: boolean
  difficulty?: 'easy' | 'medium' | 'hard'
  created_at: string
  updated_at: string
  last_reviewed_at?: string
}

/**
 * StudySession
 * 
 * Represents a study session for tracking user activity.
 */
export interface StudySession {
  id: string
  user_id: string
  deck_id?: string
  flashcard_id?: string
  session_type: 'flashcards' | 'test' | 'learn'
  score?: number
  duration_seconds: number
  completed_at: string
  created_at: string
}

// API Response types
/**
 * DashboardData
 * 
 * Represents the data structure returned for the user dashboard.
 */
export interface DashboardData {
  decks: Deck[]
  unattachedFlashcards: Flashcard[]
  recentActivity: StudySession[]
  stats: {
    totalDecks: number
    totalFlashcards: number
    studyStreak: number
    totalStudyTime: number
  }
}

// Form types
/**
 * CreateDeckData
 * 
 * Represents the data required to create a new deck.
 */
export interface CreateDeckData {
  title: string
  description?: string
  is_public: boolean
  color?: string
}

/**
 * CreateFlashcardData
 * 
 * Represents the data required to create a new flashcard.
 */
export interface CreateFlashcardData {
  front: string
  back: string
  deck_id?: string
}