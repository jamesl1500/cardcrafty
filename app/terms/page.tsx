import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { 
  Scale, 
  FileText, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <section className="pt-16 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Badge variant="secondary" className="mb-4">
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent mb-6">
              Terms of Service
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated: November 5, 2025
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Version 2.0
              </div>
            </div>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please read these Terms of Service carefully before using StudyVault. 
              By accessing or using our service, you agree to be bound by these terms.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Table of Contents */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2 text-sm">
                    <a href="#acceptance" className="block text-blue-600 hover:underline">1. Acceptance of Terms</a>
                    <a href="#description" className="block text-blue-600 hover:underline">2. Service Description</a>
                    <a href="#accounts" className="block text-blue-600 hover:underline">3. User Accounts</a>
                    <a href="#conduct" className="block text-blue-600 hover:underline">4. User Conduct</a>
                    <a href="#content" className="block text-blue-600 hover:underline">5. Content Ownership</a>
                    <a href="#privacy" className="block text-blue-600 hover:underline">6. Privacy Policy</a>
                    <a href="#payments" className="block text-blue-600 hover:underline">7. Payments & Subscriptions</a>
                    <a href="#termination" className="block text-blue-600 hover:underline">8. Termination</a>
                    <a href="#disclaimers" className="block text-blue-600 hover:underline">9. Disclaimers</a>
                    <a href="#limitation" className="block text-blue-600 hover:underline">10. Limitation of Liability</a>
                    <a href="#governing" className="block text-blue-600 hover:underline">11. Governing Law</a>
                    <a href="#changes" className="block text-blue-600 hover:underline">12. Changes to Terms</a>
                    <a href="#contact" className="block text-blue-600 hover:underline">13. Contact Information</a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Terms Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    
                    <section id="acceptance" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Scale className="h-6 w-6 text-blue-600" />
                        1. Acceptance of Terms
                      </h2>
                      <p className="mb-4">
                        By accessing and using StudyVault (&ldquo;the Service&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                      </p>
                      <p>
                        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of our website located at studyvault.com (the &ldquo;Service&rdquo;) operated by StudyVault Inc. (&ldquo;us&rdquo;, &ldquo;we&rdquo;, or &ldquo;our&rdquo;).
                      </p>
                    </section>

                    <section id="description" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
                      <p className="mb-4">
                        StudyVault is an online learning platform that allows users to create, study, and share flashcards and study materials. Our Service includes:
                      </p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Flashcard creation and management tools</li>
                        <li>Study modes with spaced repetition algorithms</li>
                        <li>Progress tracking and analytics</li>
                        <li>Search and discovery features</li>
                        <li>User accounts and profiles</li>
                        <li>Social features for sharing and collaboration</li>
                      </ul>
                      <p>
                        We reserve the right to modify, suspend, or discontinue any part of the Service at any time with or without notice.
                      </p>
                    </section>

                    <section id="accounts" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
                      <p className="mb-4">
                        To access certain features of the Service, you must register for an account. When you create an account, you must provide information that is accurate, complete, and current at all times.
                      </p>
                      <p className="mb-4">
                        You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
                      </p>
                      <p>
                        You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                      </p>
                    </section>

                    <section id="conduct" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
                      <p className="mb-4">You agree not to use the Service to:</p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, defamatory, or otherwise objectionable</li>
                        <li>Violate any applicable local, state, national, or international law or regulation</li>
                        <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
                        <li>Upload or transmit viruses, malware, or any other malicious code</li>
                        <li>Attempt to gain unauthorized access to other user accounts or the Service&apos;s infrastructure</li>
                        <li>Use the Service for any commercial purpose without our express written consent</li>
                        <li>Engage in any form of automated data collection or scraping</li>
                      </ul>
                    </section>

                    <section id="content" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">5. Content Ownership</h2>
                      <p className="mb-4">
                        You retain ownership of any content you create, upload, or share on the Service (&ldquo;User Content&rdquo;). By posting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content in connection with the Service.
                      </p>
                      <p className="mb-4">
                        You represent and warrant that you own or have the necessary rights to all User Content you post and that such content does not violate the rights of any third party.
                      </p>
                      <p>
                        We reserve the right to remove any User Content that violates these Terms or is otherwise objectionable at our sole discretion.
                      </p>
                    </section>

                    <section id="privacy" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">6. Privacy Policy</h2>
                      <p className="mb-4">
                        Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use the Service. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                      </p>
                      <p>
                        Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                      </p>
                    </section>

                    <section id="payments" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">7. Payments & Subscriptions</h2>
                      <p className="mb-4">
                        Some features of the Service may require payment. If you choose to purchase a paid subscription or features, you agree to pay all applicable fees as described on the Service.
                      </p>
                      <p className="mb-4">
                        Subscription fees are billed in advance on a recurring basis. You can cancel your subscription at any time, but cancellations will take effect at the end of the current billing period.
                      </p>
                      <p>
                        All payments are non-refundable except as required by law or as specifically stated in these Terms.
                      </p>
                    </section>

                    <section id="termination" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
                      <p className="mb-4">
                        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                      </p>
                      <p>
                        Upon termination, your right to use the Service will cease immediately. If you wish to terminate your account, you may simply discontinue using the Service or contact us for account deletion.
                      </p>
                    </section>

                    <section id="disclaimers" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">9. Disclaimers</h2>
                      <p className="mb-4">
                        The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Service or the information, content, or materials included on the Service.
                      </p>
                      <p>
                        We do not warrant that the Service will be uninterrupted or error-free, and we will not be liable for any interruptions or errors.
                      </p>
                    </section>

                    <section id="limitation" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
                      <p className="mb-4">
                        In no event shall StudyVault Inc., its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                      </p>
                      <p>
                        Our total liability to you for all claims arising out of or relating to the use of the Service shall not exceed the amount you paid us to use the Service in the 12 months preceding the claim.
                      </p>
                    </section>

                    <section id="governing" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">11. Governing Law</h2>
                      <p>
                        These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of California.
                      </p>
                    </section>

                    <section id="changes" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
                      <p className="mb-4">
                        We reserve the right to modify these Terms at any time. If we make material changes to these Terms, we will notify you by email or by posting a notice on the Service prior to the effective date of the changes.
                      </p>
                      <p>
                        Your continued use of the Service after the effective date of the revised Terms constitutes your acceptance of the changes.
                      </p>
                    </section>

                    <section id="contact" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
                      <p className="mb-4">
                        If you have any questions about these Terms of Service, please contact us at:
                      </p>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p><strong>StudyVault Inc.</strong></p>
                        <p>Email: legal@studyvault.com</p>
                        <p>Address: 123 Learning Street, Education City, CA 90210</p>
                        <p>Phone: (555) 123-4567</p>
                      </div>
                    </section>

                  </div>
                </CardContent>
              </Card>

              {/* Agreement Section */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Agreement Acknowledgment</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        By using StudyVault, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                      </p>
                      <div className="flex gap-2">
                        <Button asChild size="sm">
                          <Link href="/auth/signup">Accept & Sign Up</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/privacy">View Privacy Policy</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}