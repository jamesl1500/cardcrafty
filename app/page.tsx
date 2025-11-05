import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master any subject with
            <span className="text-indigo-600 block">Flashcards</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, study, and share flashcards to boost your learning. Join millions of students
            who are already studying smarter, not harder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link href="/auth/signup">Get Started for Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-indigo-600">📚 Create Decks</CardTitle>
              <CardDescription>
                Build custom flashcard decks for any subject or topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Organize your study materials into decks and add rich content to your flashcards
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-indigo-600">🧠 Study Smart</CardTitle>
              <CardDescription>
                Use proven learning techniques to memorize faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Practice with spaced repetition and track your progress over time
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-indigo-600">🤝 Share & Collaborate</CardTitle>
              <CardDescription>
                Share your decks with friends and study together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Create study groups and learn from others in your class or field
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start learning?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of students who are already studying more effectively
          </p>
          <Button asChild size="lg">
            <Link href="/auth/signup">Start Learning Today</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}