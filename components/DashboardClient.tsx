"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  ChevronRight,
  Calendar,
  Loader2,
  Sparkles,
  Trash2,
  AlertTriangle,
} from "lucide-react";

type Quiz = {
  id: string;
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  createdAt: string;
};

type DashboardClientProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

export default function DashboardClient({ user }: DashboardClientProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quiz");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch quizzes");
      }

      setQuizzes(data.quizzes);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (quizId: string) => {
    setQuizToDelete(quizId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!quizToDelete) return;

    try {
      setDeletingId(quizToDelete);
      const res = await fetch(`/api/quiz/${quizToDelete}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete quiz");
      }

      // Remove the quiz from the list
      setQuizzes((prevQuizzes) => prevQuizzes.filter((q) => q.id !== quizToDelete));
      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete quiz");
    } finally {
      setDeletingId(null);
    }
  };

  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter((q) => q.score > 0).length;
  const totalScore = quizzes.reduce((acc, q) => acc + q.score, 0);
  const totalPossible = quizzes.reduce((acc, q) => acc + q.total, 0);
  const averageScore = totalPossible > 0 ? ((totalScore / totalPossible) * 100).toFixed(1) : 0;

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

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with gradient */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Your Learning Dashboard</span>
        </div>
        <h1 className="text-4xl font-bold mb-2">
          Welcome back,{" "}
          <span className="bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {user.name}
          </span>
          ! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and continue your learning journey
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-lg">Loading your quizzes...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button onClick={fetchQuizzes} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Quizzes
                </CardTitle>
                <BookOpen className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  {totalQuizzes}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedQuizzes} completed
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Score
                </CardTitle>
                <Target className="w-4 h-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {averageScore}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalScore} / {totalPossible} points
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-pink-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Best Score
                </CardTitle>
                <Trophy className="w-4 h-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {quizzes.length > 0
                    ? Math.max(...quizzes.map((q) => (q.score / q.total) * 100)).toFixed(0)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">Personal best</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-green-500/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Week
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
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
              <h2 className="text-2xl md:text-3xl font-bold">Recent Quizzes</h2>
              <Link href="/generate">
                <Button className="gap-2 bg-linear-to-r from-primary to-purple-600 hover:opacity-90">
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">New Quiz</span>
                </Button>
              </Link>
            </div>

            {quizzes.length === 0 ? (
              <Card className="border-2 border-dashed border-primary/20">
                <CardContent className="py-12 md:py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">No quizzes yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Start your learning journey by creating your first AI-powered quiz!
                  </p>
                  <Link href="/generate">
                    <Button size="lg" className="gap-2 bg-linear-to-r from-primary via-purple-600 to-pink-600">
                      <Sparkles className="w-5 h-5" />
                      Generate Your First Quiz
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <Card
                    key={quiz.id}
                    className="hover:shadow-lg hover:border-primary/30 transition-all"
                  >
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 w-full sm:w-auto">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg md:text-xl font-semibold">{quiz.topic}</h3>
                            <Badge
                              variant="outline"
                              className={getDifficultyColor(quiz.difficulty)}
                            >
                              {quiz.difficulty}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 md:gap-6 text-sm text-muted-foreground flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs md:text-sm">
                                {new Date(quiz.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs md:text-sm">
                                {new Date(quiz.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          {quiz.score > 0 ? (
                            <>
                              <div className="text-right">
                                <div
                                  className={`text-2xl md:text-3xl font-bold ${getScoreColor(
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
                              <div className="flex gap-2">
                                <Link href={`/quiz/${quiz.id}`}>
                                  <Button variant="outline" size="sm" className="shrink-0">
                                    Review
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="shrink-0 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                                  onClick={() => openDeleteDialog(quiz.id)}
                                  disabled={deletingId === quiz.id}
                                >
                                  {deletingId === quiz.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <Link href={`/quiz/${quiz.id}`} className="w-full sm:w-auto">
                                <Button className="gap-2 w-full sm:w-auto bg-linear-to-r from-primary to-purple-600">
                                  Start Quiz
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                className="shrink-0 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/30"
                                onClick={() => openDeleteDialog(quiz.id)}
                                disabled={deletingId === quiz.id}
                              >
                                {deletingId === quiz.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Quiz
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone and all quiz data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setQuizToDelete(null);
              }}
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingId !== null}
              className="gap-2 mx-1"
            >
              {deletingId ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Quiz
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
