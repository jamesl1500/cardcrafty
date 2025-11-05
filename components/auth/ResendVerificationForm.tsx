"use client";

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResendVerificationForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (email === "") {
            setMessage("Email is required");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) {
                setMessage(error.message);
                setIsSuccess(false);
            } else {
                setMessage("Verification email sent successfully! Please check your inbox and spam folder.");
                setIsSuccess(true);
            }
        } catch {
            setMessage("An error occurred while sending the verification email");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="space-y-4 text-center">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                        Email Sent!
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                        {message}
                    </p>
                </div>
                
                <div className="space-y-2">
                    <Button 
                        onClick={() => {
                            setIsSuccess(false);
                            setMessage("");
                            setEmail("");
                        }} 
                        variant="outline" 
                        className="w-full"
                    >
                        Send Another Email
                    </Button>
                    <Button asChild className="w-full">
                        <Link href="/auth/login">
                            Back to Sign In
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                    Enter the email address you used to sign up
                </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
            
            {message && !isSuccess && (
                <p className="text-sm text-red-500 mt-2">{message}</p>
            )}
            
            <div className="text-center">
                <Link 
                    href="/auth/login" 
                    className="text-sm text-muted-foreground hover:text-primary"
                >
                    Back to sign in
                </Link>
            </div>
        </form>
    );
}