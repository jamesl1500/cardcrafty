import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Authentication - ${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'Sign in or create an account to start learning',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Floating Header Elements */}
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
        {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        <nav className="hidden md:flex space-x-6">
        <Link href="/features" className="text-black hover:text-gray-200 transition-colors">
          Features
        </Link>
        <Link href="/about" className="text-black hover:text-gray-200 transition-colors">
          About
        </Link>
        <Link href="/contact" className="text-black hover:text-gray-200 transition-colors">
          Contact Us
        </Link>
        </nav>
      </div>
    </div>

      {/* Left side - Image */}
      <div className="hidden lg:block relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center text-white">
            <h1 className="text-4xl font-bold mb-6">
              Master Any Subject with Flashcards
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Join students and teachers who use our platform to learn faster and remember more.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold">10M+</div>
                <div className="text-sm opacity-80">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-sm opacity-80">Teachers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">50M+</div>
                <div className="text-sm opacity-80">Study Sets</div>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
          <div className="mt-8">
            <footer className="w-full border-t mt-8 py-4 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
              <p>Made with ❤️ by <Link href="https://jameslatten.com">James Latten</Link></p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
