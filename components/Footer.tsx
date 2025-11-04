import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Qz.ai
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              AI-powered quiz generation and learning platform. Master any topic with personalized quizzes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/generate" className="hover:text-primary transition-colors">
                  Generate Quiz
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Qz.ai. All rights reserved. Built with ❤️ using Next.js & AI</p>
        </div>
      </div>
    </footer>
  );
}
