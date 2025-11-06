import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the root layout
 * This metadata will be applied to all pages unless overridden by specific page metadata.
 */
const app_name = process.env.NEXT_PUBLIC_APP_NAME || "Quizlet Clone";
const app_description = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Create and study flashcards to master any subject";
const app_tagline = process.env.NEXT_PUBLIC_APP_TAGLINE || "Craft your way to mastery with Quizlet Clone";
const app_keywords = process.env.NEXT_PUBLIC_APP_KEYWORDS || "flashcards, study, learning, quizlet clone, education, memorize, quiz, cards, online flashcards";

export const metadata: Metadata = {
  title: `${app_name} - ${app_tagline}`,
  description: app_description,
  keywords: app_keywords,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        {children}

        {/** Don't show footer on auth pages */}
        {children && !children.toString().includes('/auth/') && <Footer />}
      </body>
    </html>
  );
}
