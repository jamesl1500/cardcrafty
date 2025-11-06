import type { Metadata } from 'next'
import DeckViewPage from '@/components/decks/DeckViewPage'
import { protectPage } from '@/proxy'

export const metadata: Metadata = {
  title: `Study Deck - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'View and manage your study deck and flashcards',
}

export default async function DeckPage({ params }: { params: { deckId: string } }) {
  // Protect this page - redirect to login if not authenticated
  await protectPage(`/decks/${params.deckId}`)

  return <DeckViewPage />
}
