"use client";

import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordForm() {
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
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset_password`,
            });

            if (error) {
                setMessage(error.message);
                setIsSuccess(false);
            } else {
                setMessage("Password reset email sent successfully! Please check your inbox and spam folder.");
                setIsSuccess(true);
            }
        } catch {
            setMessage("An error occurred while sending the password reset email");
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-green-800 mb-2">
                        Email Sent!
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                        {message}
                    </p>
                    <p className="text-xs text-green-600">
                        The reset link will expire in 1 hour for security reasons.
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
                    Enter the email address associated with your account
                </p>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Email"}
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