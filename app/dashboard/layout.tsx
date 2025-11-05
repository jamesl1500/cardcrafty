import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Dashboard - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Your personal learning dashboard',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  )
}