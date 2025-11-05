"use client";

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [showResendLink, setShowResendLink] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if(password === "" || email === "")
        {
            setMessage("Email and password are required");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if(error.code === "email_not_confirmed")
                {
                    // Show resend confirmation link option
                    setMessage("Please confirm your email address before signing in.");
                    setShowResendLink(true);
                }else{
                    setMessage(error.message);
                    setShowResendLink(false);
                }
                setIsLoading(false);
            } else {
                setMessage("Signed in successfully");

                // Redirect to dashboard
                router.push("/dashboard");
            }
        } catch {
            setMessage("An error occurred while signing in");
            setIsLoading(false);
        }
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot_password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
            {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
            {showResendLink && (
              <p className="text-sm mt-2">
                <Button variant="outline" className="w-full" asChild>
                    <Link href='/auth/resend_verification'>
                        Resend confirmation email
                    </Link>
                </Button>
              </p>
            )}
        </form>
    )
};