import type { Metadata } from 'next'
import DeckViewPage from '@/components/decks/DeckViewPage'

export const metadata: Metadata = {
  title: `Study Deck - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'View and manage your study deck and flashcards',
}

export default function DeckPage() {
  return <DeckViewPage />
}
