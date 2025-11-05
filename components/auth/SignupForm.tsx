"use client";

import React from 'react'
import { useState } from 'react'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [message, setMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setMessage('You must accept the Terms of Service and Privacy Policy');
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Account created successfully');
        // Redirect to login page or dashboard
      }
    } catch {
      setMessage('An error occurred while creating your account');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignup}>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
                id="firstName"
                type="text"
                placeholder="John"
                required
                onChange={(e) => setFirstName(e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                required
                onChange={(e) => setLastName(e.target.value)}
            />
            </div>
        </div>
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
            placeholder="Create a strong password"
            required
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
        </div>
        <div className="flex items-center space-x-2">
            <input type="checkbox" id="terms" className="rounded border-gray-300" required onChange={(e) => setTermsAccepted(e.target.checked)} />
            <label htmlFor="terms" className="text-sm">
            I agree to the{' '}
            <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
            </Link>
            </label>
        </div>
        <Button type="submit" className="w-full">
            Create Account
        </Button>
        {message && <p className="text-sm text-red-500 mt-2">{message}</p>}
    </form>
  );
}