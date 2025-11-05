"use client";

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState(false);
    
    const router = useRouter();

    useEffect(() => {
        // Check if we have a valid session from the password reset link
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsValidSession(true);
            } else {
                setMessage("Invalid or expired reset link. Please request a new password reset.");
            }
        };

        checkSession();
    }, []);

    const validatePassword = (pwd: string) => {
        if (pwd.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/(?=.*[a-z])/.test(pwd)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/(?=.*[A-Z])/.test(pwd)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/(?=.*\d)/.test(pwd)) {
            return "Password must contain at least one number";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (password === "" || confirmPassword === "") {
            setMessage("Both password fields are required");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage(passwordError);
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                setMessage(error.message);
                setIsSuccess(false);
            } else {
                setMessage("Password updated successfully!");
                setIsSuccess(true);
                // Redirect to login after a short delay
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            }
        } catch {
            setMessage("An error occurred while updating your password");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    if (!isValidSession) {
        return (
            <div className="space-y-4 text-center">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-red-800 mb-2">
                        Invalid Reset Link
                    </h3>
                    <p className="text-sm text-red-700 mb-4">
                        {message}
                    </p>
                </div>
                
                <div className="space-y-2">
                    <Button asChild className="w-full">
                        <Link href="/auth/forgot_password">
                            Request New Reset Link
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/auth/login">
                            Back to Sign In
                        </Link>
                    </Button>
                </div>
            </div>
        );
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
                        Password Updated!
                    </h3>
                    <p className="text-sm text-green-700 mb-4">
                        {message}
                    </p>
                    <p className="text-xs text-green-600">
                        Redirecting you to sign in...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                </ul>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
            </Button>
            
            {message && !isSuccess && (
                <p className="text-sm text-red-500 mt-2">{message}</p>
            )}
        </form>
    );
}