import { supabase } from './supabase'
import type { Deck, Flashcard, CreateDeckData } from './types'

/**
 * DeckService
 * 
 * Service class for managing study decks and flashcards
 */
export class DeckService {
  
  /**
   * getCurrentUser
   * 
   * Get the currently authenticated user
   * 
   * @returns A promise that resolves to the user object or null if not authenticated
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  /**
   * getUserDecks
   * 
   * Get all decks for the current user
   * 
   * @param userId - Optional user ID to get decks for a specific user
   * @returns A promise that resolves to an array of Deck objects
   */
  static async getUserDecks(userId?: string): Promise<Deck[]> {
    if (userId) {
      const { data, error } = await supabase
        .from('decks')
        .select(`
          *,
          flashcards(count)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return (data || []).map(deck => ({
        ...deck,
        flashcard_count: deck.flashcards?.[0]?.count || 0
      }))
    }

    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('decks')
      .select(`
        *,
        flashcards(count)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return (data || []).map(deck => ({
      ...deck,
      flashcard_count: deck.flashcards?.[0]?.count || 0
    }))
  }

  /**
   * getDeckById
   * 
   * Get a specific deck by its ID
   * 
   * @param deckId - The ID of the deck
   * @returns A promise that resolves to the Deck object or null if not found
   */
  static async getDeckById(deckId: string): Promise<Deck | null> {
    const user = await this.getCurrentUser()

    let query = supabase
      .from('decks')
      .select(`
        *,
        flashcards(count)
      `)
      .eq('id', deckId)

    // If user is authenticated, show their own decks or public decks
    // If not authenticated, only show public decks
    if (user) {
      query = query.or(`user_id.eq.${user.id},is_public.eq.true`)
    } else {
      query = query.eq('is_public', true)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') return null // No rows returned
      throw error
    }

    return {
      ...data,
      flashcard_count: data.flashcards?.[0]?.count || 0
    }
  }

  /**
   * getDeckFlashcards
   * 
   * Get all flashcards for a specific deck
   * 
   * @param deckId - The ID of the deck
   * @returns A promise that resolves to an array of Flashcard objects
   */
  static async getDeckFlashcards(deckId: string): Promise<Flashcard[]> {
    const user = await this.getCurrentUser()

    // First check if the deck exists and is accessible
    const deck = await this.getDeckById(deckId)
    if (!deck) return []

    // If user owns the deck or deck is public, return flashcards
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  /**
   * createDeck
   * 
   * Create a new deck
   * 
   * @param deckData - An object containing the deck data
   * @returns A promise that resolves to the created Deck object
   */
  static async createDeck(deckData: CreateDeckData): Promise<Deck> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('decks')
      .insert({
        ...deckData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return { ...data, flashcard_count: 0 }
  }

  /**
   * updateDeck
   * 
   * Update an existing deck
   * 
   * @param deckId - The ID of the deck to update
   * @param updates - An object containing the fields to update
   * @returns A promise that resolves to the updated Deck object
   */
  static async updateDeck(deckId: string, updates: Partial<CreateDeckData>): Promise<Deck> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('decks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', deckId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * deleteDeck
   * 
   * Delete a deck by its ID
   * 
   * @param deckId - The ID of the deck to delete
   * @returns A promise that resolves when the deck is deleted
   */
  static async deleteDeck(deckId: string): Promise<void> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', deckId)
      .eq('user_id', user.id)

    if (error) throw error
  }

  /**
   * addFlashcardToDeck
   * 
   * Add a new flashcard to a specific deck
   * 
   * @param deckId - The ID of the deck to add the flashcard to
   * @param flashcardData - An object containing front and back content for the flashcard
   * @returns A promise that resolves to the created Flashcard object
   */
  static async addFlashcardToDeck(deckId: string, flashcardData: { front: string; back: string }): Promise<Flashcard> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        ...flashcardData,
        deck_id: deckId,
        user_id: user.id,
        is_starred: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * updateFlashcard
   * 
   * Update an existing flashcard
   * 
   * @param flashcardId - The ID of the flashcard to update
   * @param updates - An object containing the fields to update
   * @returns A promise that resolves to the updated Flashcard object
   */
  static async updateFlashcard(flashcardId: string, updates: { front?: string; back?: string; is_starred?: boolean }): Promise<Flashcard> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('flashcards')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', flashcardId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * deleteFlashcard
   * 
   * Delete a flashcard by its ID
   * 
   * @param flashcardId - The ID of the flashcard to delete
   * @returns A promise that resolves when the flashcard is deleted
   */
  static async deleteFlashcard(flashcardId: string): Promise<void> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', flashcardId)
      .eq('user_id', user.id)

    if (error) throw error
  }

  /**
   * importFlashcards
   * 
   * Import multiple flashcards into a deck using bulk insert 
   * pasted values (example: from CSV or text input). Pasted values must be separated by new lines,
   * with front and back content separated by a tab character.
   * 
   * @param deckId - The ID of the deck to import flashcards into
   * @param flashcards - An array of objects containing front and back content for each flashcard
   * @returns A promise that resolves to an array of created Flashcard objects
   */
  static async importFlashcards(deckId: string, flashcards: { front: string; back: string }[]): Promise<Flashcard[]> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('flashcards')
      .insert(
        flashcards.map(card => ({
          ...card,
          deck_id: deckId,
          user_id: user.id,
          is_starred: false
        }))
      )
      .select()

    if (error) throw error
    return data || []
  }
}