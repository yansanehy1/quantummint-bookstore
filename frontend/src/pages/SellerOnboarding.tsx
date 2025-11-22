import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  Zap,
  Users,
  TrendingUp,
  Mail,
  Shield,
} from "lucide-react";
import { useLocation } from "wouter";

interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  status: "completed" | "pending" | "in_progress";
  icon: React.ReactNode;
  action?: string;
  actionUrl?: string;
}

export default function SellerOnboarding() {
  const [, setLocation] = useLocation();
  const [tasks, setTasks] = useState<OnboardingTask[]>([
    {
      id: "email_verify",
      title: "Verify Email Address",
      description:
        "Confirm your email to activate your seller account. Check your inbox for verification link.",
      status: "pending",
      icon: <Mail className="w-6 h-6" />,
      action: "Resend Email",
    },
    {
      id: "profile_complete",
      title: "Complete Seller Profile",
      description:
        "Add profile picture, bio, and links to showcase your expertise.",
      status: "pending",
      icon: <Users className="w-6 h-6" />,
      action: "Complete Profile",
      actionUrl: "/seller-profile",
    },
    {
      id: "bank_verify",
      title: "Verify Bank Account",
      description:
        "We'll deposit $0.01 to your account. Confirm the amount to verify.",
      status: "pending",
      icon: <Shield className="w-6 h-6" />,
      action: "Verify Account",
    },
    {
      id: "first_book",
      title: "Publish Your First Book",
      description:
        "Create and publish your first book to start earning. Use our audiobook creator.",
      status: "pending",
      icon: <BookOpen className="w-6 h-6" />,
      action: "Create Book",
      actionUrl: "/audiobook-creator",
    },
    {
      id: "seller_agreement",
      title: "Review Seller Agreement",
      description:
        "Read and accept the updated seller agreement and payment terms.",
      status: "pending",
      icon: <AlertCircle className="w-6 h-6" />,
      action: "Review",
    },
  ]);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progressPercentage = (completedCount / tasks.length) * 100;

  const handleTaskAction = (taskId: string, actionUrl?: string) => {
    if (actionUrl) {
      setLocation(actionUrl);
    } else {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in_progress":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setLocation("/")}> 
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Sierra Books</h1>
          </div>
          <nav className="flex gap-4 items-center">
            <button onClick={() => setLocation("/")} className="text-gray-700 hover:text-amber-600 font-medium">Home</button>
            <button onClick={() => setLocation("/dashboard")} className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</button>
          </nav>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Sierra Books!</h1>
            <p className="text-xl text-gray-600">You're almost ready to start selling. Complete these steps to activate your seller account.</p>
          </div>
          <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Progress</h2>
                <p className="text-gray-600">{completedCount} of {tasks.length} steps completed</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-green-600">{Math.round(progressPercentage)}%</p>
              </div>
            </div>
            <progress className="onboarding-progress" value={completedCount} max={tasks.length} aria-label="Setup progress" />
          </Card>
        </section>

        {/* Onboarding Tasks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Onboarding Checklist</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className={`p-6 border-2 transition ${getStatusColor(task.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-gray-600 mt-1">{task.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                      {task.action && (
                        <Button
                          onClick={() => handleTaskAction(task.id, task.actionUrl)}
                          size="sm"
                          className={task.status === "completed" ? "bg-gray-400" : "bg-amber-600 hover:bg-amber-700"}
                          disabled={task.status === "completed"}
                        >
                          {task.status === "completed" ? "Completed" : task.action}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">{getStatusIcon(task.status)}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Start Guide */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-bold text-gray-900">Creating Content</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-1">1.</span><span>Use our Audiobook Creator to convert text to narrated audio</span></li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-1">2.</span><span>Add formulas, images, and supplementary materials</span></li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-1">3.</span><span>Set pricing in USD and SLL currencies</span></li>
                <li className="flex items-start gap-2"><span className="text-amber-600 font-bold mt-1">4.</span><span>Publish and start earning immediately</span></li>
              </ul>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Earning Money</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold mt-1">•</span><span>Earn 70% of each sale, we take 30% for platform costs</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold mt-1">•</span><span>Bonus 10% for each referral who becomes a seller</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold mt-1">•</span><span>Payments processed weekly to your verified bank account</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600 font-bold mt-1">•</span><span>Track earnings in real-time from your seller dashboard</span></li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Helpful Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition">
              <Zap className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Seller Best Practices</h3>
              <p className="text-sm text-gray-600 mb-4">Learn how to create engaging educational content that sells.</p>
              <Button variant="outline" size="sm">Read Guide</Button>
            </Card>
            <Card className="p-6 hover:shadow-lg transition">
              <Users className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Community Support</h3>
              <p className="text-sm text-gray-600 mb-4">Join our seller community for tips, feedback, and networking.</p>
              <Button variant="outline" size="sm">Join Community</Button>
            </Card>
            <Card className="p-6 hover:shadow-lg transition">
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-900 mb-2">Payment Security</h3>
              <p className="text-sm text-gray-600 mb-4">Understand how we protect your earnings and personal data.</p>
              <Button variant="outline" size="sm">Learn More</Button>
            </Card>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex gap-4 justify-center mb-12">
          <Button onClick={() => setLocation("/seller-dashboard")} className="bg-amber-600 hover:bg-amber-700 px-8">Go to Seller Dashboard</Button>
          <Button onClick={() => setLocation("/audiobook-creator")} variant="outline" className="px-8">Create Your First Book</Button>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How long does account verification take?", a: "Most accounts are verified within 24-48 hours. You'll receive an email confirmation." },
              { q: "What payment methods do you support?", a: "We support bank transfers, Orange Money, Afrimoney, and Qmoney. Payments are processed weekly." },
              { q: "Can I edit my book after publishing?", a: "Yes! You can update content, pricing, and metadata anytime from your seller dashboard." },
              { q: "What are the content guidelines?", a: "Content must be educational, original, and follow our community standards. No plagiarism or offensive material." },
              { q: "How do I get paid?", a: "Earnings are automatically transferred to your verified bank account every Friday." },
            ].map((faq, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
