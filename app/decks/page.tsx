import type { Metadata } from 'next'
import DecksListPage from '@/components/decks/DecksListPage'
import { protectPage } from '@/proxy'

export const metadata: Metadata = {
  title: `My Decks - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'View and manage all your study decks',
}

export default async function DecksPage() {
  // Protect this page - redirect to login if not authenticated
  await protectPage('/decks')

  return <DecksListPage />
}
