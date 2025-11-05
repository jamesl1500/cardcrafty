"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Star,
  Settings,
  Eye,
  EyeOff,
  BookOpen,
  Trophy,
  Timer
} from 'lucide-react'
import { DeckService } from '@/lib/deck-service'
import { StudyService } from '@/lib/study-service'
import type { Deck, Flashcard } from '@/lib/types'
import type { StudySettings as StudyServiceSettings, StudySessionData } from '@/lib/study-service'

interface StudySettings {
  showProgress: boolean
  autoFlip: boolean
  shuffleCards: boolean
  studyStarredOnly: boolean
}

interface StudySession {
  totalCards: number
  currentIndex: number
  correctCount: number
  incorrectCount: number
  startTime: Date
  answers: ('correct' | 'incorrect' | null)[]
}

export default function StudyMode() {
  const params = useParams()
  const deckId = params.deckId as string

  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Study state
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyCards, setStudyCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  // Settings
  const [settings, setSettings] = useState<StudySettings>({
    showProgress: true,
    autoFlip: false,
    shuffleCards: false,
    studyStarredOnly: false
  })
  
  // Session tracking
  const [session, setSession] = useState<StudySession>({
    totalCards: 0,
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    startTime: new Date(),
    answers: []
  })

  // Database session tracking
  const [dbSession, setDbSession] = useState<StudySessionData | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [deckData, flashcardData] = await Promise.all([
          DeckService.getDeckById(deckId),
          DeckService.getDeckFlashcards(deckId)
        ])
        
        if (!deckData) {
          setError('Deck not found')
          return
        }
        
        if (flashcardData.length === 0) {
          setError('No flashcards found in this deck')
          return
        }
        
        setDeck(deckData)
        
        // Initialize study session
        const cards = settings.studyStarredOnly 
          ? flashcardData.filter(card => card.is_starred)
          : flashcardData
          
        const finalCards = settings.shuffleCards 
          ? [...cards].sort(() => Math.random() - 0.5)
          : cards
          
        setStudyCards(finalCards)
        setSession({
          totalCards: finalCards.length,
          currentIndex: 0,
          correctCount: 0,
          incorrectCount: 0,
          startTime: new Date(),
          answers: new Array(finalCards.length).fill(null)
        })

        // Create database session
        try {
          const studySettings: StudyServiceSettings = {
            showProgress: settings.showProgress,
            shuffleCards: settings.shuffleCards,
            studyStarredOnly: settings.studyStarredOnly,
            studyMode: 'flashcards'
          }

          const sessionData = await StudyService.startStudySession({
            deck_id: deckId,
            total_cards: finalCards.length,
            study_mode: 'flashcards',
            settings: studySettings
          })
          setDbSession(sessionData)
        } catch (error) {
          console.error('Failed to create study session:', error)
          // Continue without database tracking
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load deck')
      } finally {
        setLoading(false)
      }
    }

    if (deckId) {
      loadData()
    }
  }, [deckId, settings.shuffleCards, settings.studyStarredOnly, settings.showProgress])

  // Handle session completion
  useEffect(() => {
    if (isComplete && dbSession && studyCards.length > 0) {
      const completeSession = async () => {
        try {
          const duration = Date.now() - session.startTime.getTime()
          const durationSeconds = Math.round(duration / 1000)
          const score = Math.round((session.correctCount / studyCards.length) * 100)
          
          await StudyService.updateStudySession(dbSession.id!, {
            completed_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            accuracy: score,
            cards_studied: studyCards.length,
            correct_answers: session.correctCount,
            incorrect_answers: session.incorrectCount
          })
        } catch (error) {
          console.error('Failed to complete study session:', error)
        }
      }
      
      completeSession()
    }
  }, [isComplete, dbSession, studyCards.length, session.correctCount, session.incorrectCount, session.startTime])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = async (isCorrect: boolean) => {
    const newAnswers = [...session.answers]
    const currentAnswer = newAnswers[currentIndex]
    const currentCard = studyCards[currentIndex]
    
    // Update counts
    let correctCount = session.correctCount
    let incorrectCount = session.incorrectCount
    
    // Remove previous answer if exists
    if (currentAnswer === 'correct') correctCount--
    if (currentAnswer === 'incorrect') incorrectCount--
    
    // Add new answer
    newAnswers[currentIndex] = isCorrect ? 'correct' : 'incorrect'
    if (isCorrect) correctCount++
    else incorrectCount++
    
    setSession(prev => ({
      ...prev,
      correctCount,
      incorrectCount,
      answers: newAnswers
    }))

    // Record answer in database
    if (dbSession && currentCard) {
      try {
        await StudyService.recordAnswer({
          session_id: dbSession.id!,
          flashcard_id: currentCard.id,
          answer: isCorrect ? 'correct' : 'incorrect',
          response_time_ms: Date.now() - session.startTime.getTime()
        })
      } catch (error) {
        console.error('Failed to record answer:', error)
      }
    }
    
    // Auto advance to next card
    setTimeout(() => {
      handleNext()
    }, 500)
  }

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleRestart = async () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setIsComplete(false)
    setSession({
      totalCards: studyCards.length,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      startTime: new Date(),
      answers: new Array(studyCards.length).fill(null)
    })

    // Create new database session
    if (deckId) {
      try {
        const studySettings: StudyServiceSettings = {
          showProgress: settings.showProgress,
          shuffleCards: settings.shuffleCards,
          studyStarredOnly: settings.studyStarredOnly,
          studyMode: 'flashcards'
        }

        const sessionData = await StudyService.startStudySession({
          deck_id: deckId,
          total_cards: studyCards.length,
          study_mode: 'flashcards',
          settings: studySettings
        })
        setDbSession(sessionData)
      } catch (error) {
        console.error('Failed to create new study session:', error)
      }
    }
  }

  const getStudyTime = () => {
    const now = new Date()
    const diff = now.getTime() - session.startTime.getTime()
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAccuracy = () => {
    const total = session.correctCount + session.incorrectCount
    if (total === 0) return 0
    return Math.round((session.correctCount / total) * 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading study session...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Study Session Error</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button asChild>
                <Link href={`/decks/${deckId}`}>Back to Deck</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentCard = studyCards[currentIndex]

  if (isComplete) {
    const accuracy = getAccuracy()
    const studyTime = getStudyTime()
    
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">Study Session Complete!</h1>
            <p className="text-muted-foreground mb-8">
              Great job studying {deck.title}
            </p>
            
            {/* Results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{studyCards.length}</div>
                <div className="text-sm text-muted-foreground">Cards Studied</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{session.correctCount}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">{session.incorrectCount}</div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>Study time: {studyTime}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleRestart} size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Study Again
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`/decks/${deckId}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Deck
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/decks/${deckId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Study
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{deck.title}</h1>
            <p className="text-sm text-muted-foreground">
              Card {currentIndex + 1} of {studyCards.length}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      {settings.showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {getAccuracy()}% accuracy
            </span>
          </div>
          <Progress value={(currentIndex / studyCards.length) * 100} className="h-2" />
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-1">
          <Check className="h-4 w-4 text-green-600" />
          <span>{session.correctCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <X className="h-4 w-4 text-red-600" />
          <span>{session.incorrectCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4 text-muted-foreground" />
          <span>{getStudyTime()}</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <Card 
          className="w-full h-80 cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={handleFlip}
        >
          <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">
                {isFlipped ? 'Back' : 'Front'}
              </Badge>
              {currentCard.is_starred && (
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 inline ml-2" />
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg leading-relaxed max-w-2xl">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isFlipped ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>Click to {isFlipped ? 'flip back' : 'reveal answer'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {/* Answer Buttons (only show when flipped) */}
        {isFlipped && (
          <div className="flex gap-3">
            <Button 
              variant="outline"
              size="lg"
              onClick={() => handleAnswer(false)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Incorrect
            </Button>
            <Button 
              size="lg"
              onClick={() => handleAnswer(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Correct
            </Button>
          </div>
        )}

        {/* Next Button */}
        <Button 
          variant="outline" 
          onClick={handleNext}
          disabled={currentIndex === studyCards.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Study Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Show progress bar</span>
                <input 
                  type="checkbox" 
                  checked={settings.showProgress}
                  onChange={(e) => setSettings(prev => ({ ...prev, showProgress: e.target.checked }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Study starred cards only</span>
                <input 
                  type="checkbox" 
                  checked={settings.studyStarredOnly}
                  onChange={(e) => setSettings(prev => ({ ...prev, studyStarredOnly: e.target.checked }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Shuffle cards</span>
                <input 
                  type="checkbox" 
                  checked={settings.shuffleCards}
                  onChange={(e) => setSettings(prev => ({ ...prev, shuffleCards: e.target.checked }))}
                  className="rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}