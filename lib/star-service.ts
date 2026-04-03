/**
 * star-service
 * 
 * Service for managing starred flashcards functionality
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export class StarService {
  /**
   * Toggle star status for a flashcard
   * @param flashcardId - The ID of the flashcard to star/unstar
   * @param isCurrentlyStar - Whether the flashcard is currently starred
   * @returns The updated star status
   */
  static async toggleFlashcardStar(
    flashcardId: string,
    isCurrentlyStar: boolean
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User not authenticated')
      }

      if (isCurrentlyStar) {
        // Unstar the flashcard
        const { error } = await supabase
          .from('starred_flashcards')
          .delete()
          .eq('user_id', user.id)
          .eq('flashcard_id', flashcardId)

        if (error) throw error
        return false
      } else {
        // Star the flashcard
        const { error } = await supabase
          .from('starred_flashcards')
          .insert({
            user_id: user.id,
            flashcard_id: flashcardId,
          })

        if (error) throw error
        return true
      }
    } catch (error) {
      console.error('Error toggling flashcard star:', error)
      throw error
    }
  }

  /**
   * Get all starred flashcard IDs for the current user
   * @returns Array of starred flashcard IDs
   */
  static async getStarredFlashcardIds(): Promise<string[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return []
      }

      const { data, error } = await supabase
        .from('starred_flashcards')
        .select('flashcard_id')
        .eq('user_id', user.id)

      if (error) throw error
      return data?.map((item) => item.flashcard_id) || []
    } catch (error) {
      console.error('Error getting starred flashcards:', error)
      return []
    }
  }

  /**
   * Check if a specific flashcard is starred
   * @param flashcardId - The ID of the flashcard to check
   * @returns Whether the flashcard is starred
   */
  static async isFlashcardStarred(flashcardId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return false
      }

      const { data, error } = await supabase
        .from('starred_flashcards')
        .select('id')
        .eq('user_id', user.id)
        .eq('flashcard_id', flashcardId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Error checking if flashcard is starred:', error)
      return false
    }
  }
}
