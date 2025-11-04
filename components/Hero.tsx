"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-background -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Quiz Generation</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Learn Smarter with{" "}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Generated Quizzes
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Create personalized quizzes on any topic in seconds. Choose your difficulty,
            test your knowledge, and track your progress with intelligent AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/generate">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Generate a Quiz
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  View Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
              <p className="text-sm text-muted-foreground">
                Create quizzes on any topic in seconds with advanced AI
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Difficulty Levels</h3>
              <p className="text-sm text-muted-foreground">
                Choose from easy, medium, or hard to match your skill level
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your learning journey and improve over time
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
