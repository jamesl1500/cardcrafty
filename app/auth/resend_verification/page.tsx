import type { Metadata } from 'next'
import Link from 'next/link'
import ResendVerificationForm from '@/components/auth/ResendVerificationForm'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: `Resend Verification - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Resend email verification to activate your account',
}

export default function ResendVerificationPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Verify Your Email</h1>
        <p className="text-muted-foreground">
          Resend the verification email to activate your account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resend Verification Email</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a new verification link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ResendVerificationForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <div className="space-y-1">
              <div>
                Need help?{' '}
                <Link href="/support" className="text-primary hover:underline">
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Didn&apos;t receive the email?
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Check your spam or junk folder</li>
                <li>Make sure you entered the correct email address</li>
                <li>Wait a few minutes for the email to arrive</li>
                <li>Add our email to your contacts to avoid future filtering</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
