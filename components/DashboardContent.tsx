"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Calendar,
} from "lucide-react";

type Quiz = {
  id: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  createdAt: Date;
};

type DashboardContentProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  quizzes: Quiz[];
};

export default function DashboardContent({ user, quizzes }: DashboardContentProps) {
  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter((q) => q.score > 0).length;
  const totalScore = quizzes.reduce((acc, q) => acc + q.score, 0);
  const totalPossible = quizzes.reduce((acc, q) => acc + q.total, 0);
  const averageScore = totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "hard":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Track your progress and continue your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Quizzes
            </CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedQuizzes} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Score
            </CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalScore} / {totalPossible} points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Score
            </CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {quizzes.length > 0
                ? Math.max(...quizzes.map((q) => (q.score / q.total) * 100)).toFixed(0)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">Personal best</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Week
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                quizzes.filter(
                  (q) =>
                    new Date(q.createdAt).getTime() >
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground mt-1">Quizzes taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quizzes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Quizzes</h2>
          <Link href="/generate">
            <Button className="gap-2">
              <BookOpen className="w-4 h-4" />
              New Quiz
            </Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your learning journey by creating your first quiz!
              </p>
              <Link href="/generate">
                <Button size="lg" className="gap-2">
                  Generate Your First Quiz
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{quiz.topic}</h3>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(quiz.difficulty)}
                        >
                          {quiz.difficulty}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(quiz.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {quiz.score > 0 ? (
                        <>
                          <div className="text-right">
                            <div
                              className={`text-2xl font-bold ${getScoreColor(
                                quiz.score,
                                quiz.total
                              )}`}
                            >
                              {quiz.score}/{quiz.total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {((quiz.score / quiz.total) * 100).toFixed(0)}%
                            </div>
                          </div>
                          <Link href={`/quiz/${quiz.id}`}>
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Link href={`/quiz/${quiz.id}`}>
                          <Button className="gap-2">
                            Start Quiz
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
