"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Qz.ai
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/generate">
              <Button variant="default">Generate Quiz</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default">Get Started</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
