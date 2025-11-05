import type { Metadata } from 'next'
import StudyMode from '@/components/study/StudyMode'

export const metadata: Metadata = {
  title: 'Study Mode - ',
  description: 'Study your flashcards in an interactive session',
}

export default function StudyPage() {
  return <StudyMode />
}