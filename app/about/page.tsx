import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  Target, 
  Zap, 
  Heart, 
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              About {process.env.NEXT_PUBLIC_APP_NAME}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Your Knowledge Vault for Mastering Any Subject
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {process.env.NEXT_PUBLIC_APP_NAME} is a modern, flashcard platform designed to make learning 
              more effective, engaging, and accessible for students, professionals, and lifelong learners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that learning should be personalized, efficient, and enjoyable. 
                Our mission is to empower learners worldwide with tools that adapt to their 
                unique learning style and help them achieve their educational goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Evidence-based learning techniques</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Personalized study experiences</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Comprehensive progress tracking</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <BookOpen className="h-12 w-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Built for Learners</h3>
              <p className="text-blue-100">
                From medical students memorizing anatomy to language learners mastering vocabulary, 
                StudyVault adapts to your learning journey with intelligent features and beautiful design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Effectiveness First</CardTitle>
                <CardDescription>
                  Every feature is designed with learning science in mind, ensuring your study time is optimized for maximum retention and understanding.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Accessibility</CardTitle>
                <CardDescription>
                  Learning should be available to everyone, everywhere. We build inclusive tools that work across devices and learning abilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>User-Centric Design</CardTitle>
                <CardDescription>
                  We listen to our community and continuously improve based on real user feedback and learning research.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-xl text-muted-foreground">
              How {process.env.NEXT_PUBLIC_APP_NAME} came to be
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">
                {process.env.NEXT_PUBLIC_APP_NAME} was born from a simple observation: traditional study methods weren&apos;t keeping up 
                with how we actually learn in the digital age. After years of using outdated flashcard tools 
                and struggling with ineffective study techniques, we decided to build something better.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                Drawing from cognitive science research and modern UX principles, we created a platform that 
                not only looks beautiful but actually helps you learn more effectively. Features like spaced 
                repetition, progress analytics, and adaptive study modes aren&apos;t just buzzwords&mdash;they&apos;re 
                evidence-based tools that make a real difference in learning outcomes.
              </p>

              <p className="text-lg leading-relaxed">
                Today, {process.env.NEXT_PUBLIC_APP_NAME} helps thousands of learners around the world master everything from 
                medical terminology to programming concepts. But we&apos;re just getting started. Our vision 
                is to become the most effective and beloved learning platform on the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Passion</h2>
            <p className="text-xl text-muted-foreground">
              Our team is dedicated to making learning better for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  We&apos;re constantly exploring new ways to make learning more effective through technology and design.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Excellence</CardTitle>
                <CardDescription>
                  Every detail matters. We strive for excellence in code quality, user experience, and customer support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  We believe in the power of community and collaborative learning to achieve better outcomes for everyone.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have already discovered the power of effective, 
            personalized studying with StudyVault.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}