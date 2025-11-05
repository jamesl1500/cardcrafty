"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Brain, Flame, Clock } from 'lucide-react'

interface StatsCardProps {
  totalDecks: number
  totalFlashcards: number
  studyStreak: number
  totalStudyTime: number
}

export default function StatsCards({ totalDecks, totalFlashcards, studyStreak, totalStudyTime }: StatsCardProps) {
  const stats = [
    {
      title: "Study Decks",
      value: totalDecks,
      icon: BookOpen,
      description: "Created decks"
    },
    {
      title: "Flashcards",
      value: totalFlashcards,
      icon: Brain,
      description: "Total cards"
    },
    {
      title: "Study Streak",
      value: studyStreak,
      icon: Flame,
      description: `${studyStreak} day${studyStreak !== 1 ? 's' : ''}`
    },
    {
      title: "Study Time",
      value: totalStudyTime,
      icon: Clock,
      description: "Minutes studied"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}