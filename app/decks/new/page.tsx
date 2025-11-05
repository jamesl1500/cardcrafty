import type { Metadata } from 'next'
import CreateDeckForm from '@/components/decks/CreateDeckForm'

export const metadata: Metadata = {
  title: `Create New Deck - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Create a new study deck to organize your flashcards',
}

export default function NewDeckPage() {
  return <CreateDeckForm />
}
