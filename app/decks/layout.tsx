import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Study Decks - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Manage your study decks and flashcards',
}

export default function DecksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
