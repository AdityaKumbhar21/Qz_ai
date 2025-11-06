"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function CTA() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Start Learning Today</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Transform Your Learning?
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners using AI to master new topics faster and more effectively.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/generate">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Generate Your First Quiz
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>

          <p className="text-sm text-muted-foreground">
            No credit card required • Unlimited quizzes
          </p>
        </div>
      </div>
    </section>
  );
}
