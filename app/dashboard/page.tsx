import type { Metadata } from 'next'
import Dashboard from '@/components/dashboard/Dashboard'
import { protectPage } from '@/policy'

export const metadata: Metadata = {
  title: `Dashboard - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Your personal learning dashboard with study decks and flashcards',
}

export default async function DashboardPage() {
  // Protect this page - redirect to login if not authenticated
  await protectPage('/dashboard')

  return (
    <div className="container mx-auto py-8 px-4">
      <Dashboard />
    </div>
  )
}
