import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  Eye, 
  Clock,
  Lock,
  Server,
  Users,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
              Privacy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Privacy Policy
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
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your privacy is important to us. This policy explains what information we collect, 
              how we use it, and your rights regarding your personal data.
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
                    <a href="#overview" className="block text-green-600 hover:underline">1. Overview</a>
                    <a href="#information" className="block text-green-600 hover:underline">2. Information We Collect</a>
                    <a href="#usage" className="block text-green-600 hover:underline">3. How We Use Information</a>
                    <a href="#sharing" className="block text-green-600 hover:underline">4. Information Sharing</a>
                    <a href="#security" className="block text-green-600 hover:underline">5. Data Security</a>
                    <a href="#retention" className="block text-green-600 hover:underline">6. Data Retention</a>
                    <a href="#rights" className="block text-green-600 hover:underline">7. Your Rights</a>
                    <a href="#cookies" className="block text-green-600 hover:underline">8. Cookies & Tracking</a>
                    <a href="#international" className="block text-green-600 hover:underline">9. International Transfers</a>
                    <a href="#children" className="block text-green-600 hover:underline">10. Children&apos;s Privacy</a>
                    <a href="#changes" className="block text-green-600 hover:underline">11. Policy Changes</a>
                    <a href="#contact" className="block text-green-600 hover:underline">12. Contact Us</a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Policy Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    
                    <section id="overview" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="h-6 w-6 text-green-600" />
                        1. Overview
                      </h2>
                      <p className="mb-4">
                        StudyVault Inc. (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our StudyVault service.
                      </p>
                      <p>
                        This policy applies to all information collected through our website, mobile applications, and any related services, sales, marketing, or events (collectively, the &ldquo;Service&rdquo;).
                      </p>
                    </section>

                    <section id="information" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                      
                      <h3 className="text-xl font-semibold mb-3">Personal Information You Provide</h3>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Account Information:</strong> Name, email address, password, profile picture</li>
                        <li><strong>Profile Information:</strong> Bio, learning preferences, educational background</li>
                        <li><strong>User Content:</strong> Flashcards, study sets, notes, and other content you create</li>
                        <li><strong>Communication Data:</strong> Messages you send to us or other users</li>
                        <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely by third-party payment processors)</li>
                      </ul>

                      <h3 className="text-xl font-semibold mb-3">Information We Collect Automatically</h3>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Usage Data:</strong> How you interact with the Service, study patterns, time spent</li>
                        <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                        <li><strong>Log Data:</strong> Server logs, access times, pages viewed, referring websites</li>
                        <li><strong>Performance Data:</strong> Study session analytics, response times, accuracy rates</li>
                        <li><strong>Location Data:</strong> General location based on IP address (not precise location)</li>
                      </ul>
                    </section>

                    <section id="usage" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                      <p className="mb-4">We use the information we collect to:</p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Provide, maintain, and improve the Service</li>
                        <li>Create and manage your account</li>
                        <li>Process transactions and send related information</li>
                        <li>Send you technical notices, security alerts, and administrative messages</li>
                        <li>Respond to your comments, questions, and provide customer service</li>
                        <li>Monitor and analyze usage patterns to improve user experience</li>
                        <li>Personalize your learning experience and study recommendations</li>
                        <li>Detect, investigate, and prevent fraudulent or illegal activities</li>
                        <li>Comply with legal obligations and protect our rights</li>
                      </ul>
                    </section>

                    <section id="sharing" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">4. Information Sharing</h2>
                      <p className="mb-4">We do not sell, trade, or rent your personal information. We may share your information only in the following circumstances:</p>
                      
                      <h3 className="text-xl font-semibold mb-3">With Your Consent</h3>
                      <p className="mb-4">We may share your information when you explicitly consent to such sharing.</p>

                      <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
                      <p className="mb-4">We may share your information with third-party service providers who perform services on our behalf, such as:</p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Cloud hosting and data storage</li>
                        <li>Payment processing</li>
                        <li>Email communication services</li>
                        <li>Analytics and performance monitoring</li>
                        <li>Customer support tools</li>
                      </ul>

                      <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
                      <p className="mb-4">We may disclose your information if required by law or if we believe such action is necessary to:</p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Comply with legal obligations</li>
                        <li>Protect and defend our rights or property</li>
                        <li>Prevent or investigate possible wrongdoing</li>
                        <li>Protect the safety of users or the public</li>
                      </ul>
                    </section>

                    <section id="security" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="h-6 w-6 text-green-600" />
                        5. Data Security
                      </h2>
                      <p className="mb-4">
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                      </p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Encryption:</strong> Data in transit and at rest is encrypted using industry-standard protocols</li>
                        <li><strong>Access Controls:</strong> Strict access controls and authentication measures</li>
                        <li><strong>Regular Audits:</strong> Regular security assessments and vulnerability testing</li>
                        <li><strong>Employee Training:</strong> Staff training on data protection and security practices</li>
                        <li><strong>Incident Response:</strong> Procedures for detecting and responding to security incidents</li>
                      </ul>
                    </section>

                    <section id="retention" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                      <p className="mb-4">
                        We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                      </p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
                        <li><strong>Study Data:</strong> Retained for the lifetime of your account to maintain learning progress</li>
                        <li><strong>Usage Logs:</strong> Typically retained for 12 months for security and analytics purposes</li>
                        <li><strong>Payment Records:</strong> Retained as required by law and for tax purposes</li>
                      </ul>
                    </section>

                    <section id="rights" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
                      <p className="mb-4">You have the following rights regarding your personal information:</p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Access:</strong> Request access to your personal information</li>
                        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                        <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                        <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                        <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                        <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                        <li><strong>Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
                      </ul>
                      <p>
                        To exercise these rights, please contact us using the information provided in the Contact section.
                      </p>
                    </section>

                    <section id="cookies" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">8. Cookies & Tracking Technologies</h2>
                      <p className="mb-4">
                        We use cookies and similar tracking technologies to enhance your experience on our Service:
                      </p>
                      <ul className="list-disc list-inside space-y-2 mb-4">
                        <li><strong>Essential Cookies:</strong> Required for the Service to function properly</li>
                        <li><strong>Performance Cookies:</strong> Help us understand how you use the Service</li>
                        <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                        <li><strong>Analytics Cookies:</strong> Provide insights into usage patterns and performance</li>
                      </ul>
                      <p>
                        You can control cookies through your browser settings, but disabling certain cookies may affect the functionality of the Service.
                      </p>
                    </section>

                    <section id="international" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
                      <p className="mb-4">
                        Your information may be transferred to and processed in countries other than your country of residence. We ensure that such transfers comply with applicable data protection laws and provide adequate protection for your personal information.
                      </p>
                    </section>

                    <section id="children" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">10. Children&apos;s Privacy</h2>
                      <p className="mb-4">
                        Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                      </p>
                    </section>

                    <section id="changes" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
                      <p className="mb-4">
                        We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
                      </p>
                      <p>
                        We encourage you to review this Privacy Policy periodically for any changes. Your continued use of the Service after any modifications constitutes your acceptance of the updated policy.
                      </p>
                    </section>

                    <section id="contact" className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                      <p className="mb-4">
                        If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                      </p>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p><strong>StudyVault Inc.</strong></p>
                        <p><strong>Privacy Officer</strong></p>
                        <p>Email: privacy@studyvault.com</p>
                        <p>Address: 123 Learning Street, Education City, CA 90210</p>
                        <p>Phone: (555) 123-4567</p>
                      </div>
                    </section>

                  </div>
                </CardContent>
              </Card>

              {/* Privacy Summary */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Data Protection</h4>
                        <p className="text-xs text-muted-foreground">Your data is encrypted and secure</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Your Rights</h4>
                        <p className="text-xs text-muted-foreground">Access, correct, or delete your data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Server className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">Transparency</h4>
                        <p className="text-xs text-muted-foreground">Clear policies and practices</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Section */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Privacy Commitment</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We are committed to protecting your privacy and being transparent about our data practices.
                      </p>
                      <div className="flex gap-2">
                        <Button asChild size="sm">
                          <Link href="/auth/signup">Get Started Safely</Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/terms">View Terms of Service</Link>
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