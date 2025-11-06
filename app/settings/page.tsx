import type { Metadata } from 'next'
import Settings from '@/components/settings/Settings'
import { protectPage } from '@/proxy'

export const metadata: Metadata = {
  title: `Settings - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Manage your profile and account settings',
}

export default async function SettingsPage() {
  // Protect this page - redirect to login if not authenticated
  await protectPage('/settings')

  return (
    <div className="container mx-auto py-8 px-4 pt-24">
      <Settings />
    </div>
  )
}
