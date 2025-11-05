'use client'

/**
 * AppLayout component
 * 
 * This component serves as the main layout for the application, wrapping around all pages.
 * It includes the Header and CommandPalette components.
 * 
 * @param {AppLayoutProps} props - The component props
 * @returns {JSX.Element} The rendered AppLayout component
 */
import { ReactNode } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CommandPalette, { useCommandPalette } from '@/components/search/CommandPalette'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isOpen, close } = useCommandPalette()

  return (
    <>
      <Header />
      <main>{children}</main>
      <CommandPalette isOpen={isOpen} onClose={close} />
      <Footer />
    </>
  )
}