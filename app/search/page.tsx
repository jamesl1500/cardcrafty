import SearchPage from '@/components/search/SearchPage'

export const metadata = {
  title: `Search - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Search through your decks and flashcards',
}

export default function Search() {
  return <SearchPage />
}