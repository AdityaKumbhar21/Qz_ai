"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Send,
  Loader2,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

const difficultyOptions = [
  {
    value: "easy",
    label: "Easy",
    icon: Zap,
    description: "Perfect for beginners",
    color: "text-green-600 bg-green-500/10 border-green-500/20 hover:bg-green-500/20",
  },
  {
    value: "medium",
    label: "Medium",
    icon: Target,
    description: "Balanced challenge",
    color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20",
  },
  {
    value: "hard",
    label: "Hard",
    icon: TrendingUp,
    description: "Expert level",
    color: "text-red-600 bg-red-500/10 border-red-500/20 hover:bg-red-500/20",
  },
];

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate quiz");
      }

      if (data.quizId) {
        router.push(`/quiz/${data.quizId}`);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Quiz Generator</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What would you like to{" "}
            <span className="bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              learn today?
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter any topic and choose your difficulty level. Our AI will generate a personalized quiz just for you.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Difficulty Selection */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <label className="block text-sm font-medium mb-4">
                Choose Difficulty Level
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDifficulty(option.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      difficulty === option.value
                        ? option.color + " border-current"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <option.icon
                        className={`w-8 h-8 ${
                          difficulty === option.value
                            ? option.color.split(" ")[0]
                            : "text-muted-foreground"
                        }`}
                      />
                      <div>
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {difficulty === option.value && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Topic Input - ChatGPT Style */}
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="relative">
                  <textarea
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter your topic... (e.g., React Hooks, World War II, Python Basics)"
                    className="w-full min-h-[120px] p-6 pr-20 text-lg resize-none bg-transparent border-0 focus:outline-none focus:ring-0"
                    disabled={loading}
                  />

                  <div className="absolute bottom-4 right-4">
                    <Button
                      type="submit"
                      disabled={loading || !topic.trim()}
                      size="lg"
                      className="rounded-xl px-6 h-12 gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Generate</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="px-6 pb-4 pt-2 border-t border-border bg-muted/30">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Press Enter to generate • Shift + Enter for new line</span>
                    <span>{topic.length} / 200</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips */}
          {!loading && (
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-1">💡 Be Specific</h4>
                  <p className="text-xs text-muted-foreground">
                    "React useEffect hook" works better than just "React"
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-500/5 border-purple-500/10">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-1">🎯 Any Topic</h4>
                  <p className="text-xs text-muted-foreground">
                    Programming, history, science, languages - anything!
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-pink-500/5 border-pink-500/10">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-1">📊 Track Progress</h4>
                  <p className="text-xs text-muted-foreground">
                    All your scores are saved in your dashboard
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
