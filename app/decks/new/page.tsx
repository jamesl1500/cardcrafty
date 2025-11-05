import type { Metadata } from 'next'
import CreateDeckForm from '@/components/decks/CreateDeckForm'
import { protectPage } from '@/policy'

export const metadata: Metadata = {
  title: `Create New Deck - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Create a new study deck to organize your flashcards',
}

export default async function NewDeckPage() {
  // Protect this page - redirect to login if not authenticated
  await protectPage('/decks/new')

  return <CreateDeckForm />
}
