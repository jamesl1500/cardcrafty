import { Suspense } from 'react'
import SearchPage from '@/components/search/SearchPage'
import { protectPage } from '@/proxy'

export const metadata = {
  title: `Search - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Search through your decks and flashcards',
}

function SearchPageWrapper() {
  return <SearchPage />
}

export default async function Search() {
  // Protect this page - redirect to login if not authenticated
  await protectPage('/search')

  return (
    <Suspense fallback={
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading search...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageWrapper />
    </Suspense>
  )
}