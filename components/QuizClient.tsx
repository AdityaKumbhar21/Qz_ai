"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import FlashCardQuiz from "./FlashCardQuiz";
import { Badge } from "./ui/badge";

type Quiz = {
  id: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  questions: any[];
};

export default function QuizClient({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quiz/${quizId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch quiz");
      }

      setQuiz(data.quiz);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
        <p className="text-muted-foreground">
          {error || "This quiz doesn't exist or you don't have access to it."}
        </p>
      </div>
    );
  }

  const safeQuestions = (quiz.questions as any[]).map((q: any) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    answer: q.answer,
  }));

  // Check if quiz is already completed (has score > 0)
  const isCompleted = quiz.score > 0;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      {/* Header - Reduced Size */}
      <div className="max-w-2xl mx-auto mb-4 md:mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-3">
          <Sparkles className="w-3 h-3" />
          <span className="text-xs font-medium">Quiz Time</span>
        </div>
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
          <span className="bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {quiz.topic}
          </span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-muted-foreground">
          <Badge
            variant="outline"
            className={`${getDifficultyColor(quiz.difficulty)} capitalize`}
          >
            {quiz.difficulty}
          </Badge>
          <Badge variant="outline" className="bg-muted/30">
            {safeQuestions.length} Questions
          </Badge>
          {isCompleted && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              Completed: {quiz.score}/{quiz.total}
            </Badge>
          )}
        </div>
      </div>

      {/* Quiz Component */}
      <FlashCardQuiz 
        quizId={quiz.id} 
        questions={safeQuestions}
        initialScore={quiz.score}
        isReview={isCompleted}
      />
    </div>
  );
}
