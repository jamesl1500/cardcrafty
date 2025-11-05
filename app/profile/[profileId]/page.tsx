import type { Metadata } from 'next';
import Profile from '@/components/profile';

import { getUserById } from '@/lib/user-service';

export const metadata: Metadata = {
  title: `Profile - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'View your profile and study statistics',
}

export default async function ProfilePage({ params }: { params: { profileId: string } }) {
  const { profileId } = await params;

  const user = await getUserById(profileId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto py-8 px-4">
        <Profile user={user} />
      </div>
    </div>
  )
}
