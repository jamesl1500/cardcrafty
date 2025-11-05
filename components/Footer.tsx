"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Mail, Github, Twitter } from "lucide-react";
import type { User } from '@supabase/supabase-js'

export default function Footer() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return <div className="w-full border-t mt-8 py-4 text-center text-sm text-gray-500">Loading...</div>
  }

  return (
    <footer className="w-full border-t bg-slate-50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">StudyVault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your knowledge vault for mastering any subject.
            </p>
            <div className="flex items-center gap-4">
              <a href="mailto:hello@studyvault.com" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </a>
              <a href="https://github.com" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/decks" className="text-muted-foreground hover:text-foreground">
                      My Decks
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/auth/signup" className="text-muted-foreground hover:text-foreground">
                      Sign Up Free
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
                      Sign In
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} StudyVault Inc. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for learners everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}