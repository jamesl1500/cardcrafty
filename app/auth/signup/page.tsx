import type { Metadata } from 'next'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import SignupForm from '@/components/auth/SignupForm'
import { redirectIfAuthenticated } from '@/policy'

export const metadata: Metadata = {
  title: `Sign Up - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Create a new account to start your learning journey',
}

export default async function SignupPage() {
  // Redirect to dashboard if already authenticated
  await redirectIfAuthenticated()
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">
          Join thousands of students and start learning today
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignupForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
