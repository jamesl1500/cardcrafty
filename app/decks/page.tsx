import type { Metadata } from 'next'
import DecksListPage from '@/components/decks/DecksListPage'

export const metadata: Metadata = {
  title: `My Decks - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'View and manage all your study decks',
}

export default function DecksPage() {
  return <DecksListPage />
}
