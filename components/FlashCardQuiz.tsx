'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ChevronRight, Trophy, Home, RotateCcw, Sparkles } from 'lucide-react';
import Link from 'next/link';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

type FlashCardQuizProps = {
  quizId: string;
  questions: Question[];
  initialScore?: number;
  isReview?: boolean;
};

export default function FlashCardQuiz({ 
  quizId, 
  questions, 
  initialScore = 0,
  isReview = false 
}: FlashCardQuizProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(isReview);
  const [score, setScore] = useState(initialScore);
  const [answered, setAnswered] = useState<boolean[]>(
    isReview ? new Array(questions.length).fill(true) : new Array(questions.length).fill(false)
  );
  const [quizCompleted, setQuizCompleted] = useState(false);

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isCorrect = selected === q.answer;
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const handleSelect = (opt: string) => {
    if (answered[currentIdx] || isReview) return;
    setSelected(opt);
    setShowResult(true);
    if (opt === q.answer) {
      setScore(s => s + 1);
    }
    setAnswered(a => {
      const copy = [...a];
      copy[currentIdx] = true;
      return copy;
    });
  };

  const goNext = () => {
    if (isLast) {
      if (isReview) {
        // Just go to completion screen for review
        setQuizCompleted(true);
      } else {
        submitScore();
      }
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowResult(isReview);
    }
  };

  const submitScore = async () => {
    try {
      await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finalScore: score }),
      });
      setQuizCompleted(true);
    } catch (error) {
      // Silent fail - score already calculated on frontend
      setQuizCompleted(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { emoji: '🎉', message: 'Perfect Score!', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 80) return { emoji: '🌟', message: 'Excellent!', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 60) return { emoji: '👍', message: 'Good Job!', color: 'text-yellow-600 dark:text-yellow-400' };
    if (percentage >= 40) return { emoji: '💪', message: 'Keep Practicing!', color: 'text-orange-600 dark:text-orange-400' };
    return { emoji: '📚', message: 'Keep Learning!', color: 'text-red-600 dark:text-red-400' };
  };

  if (quizCompleted) {
    const { emoji, message, color } = getScoreMessage();
    const percentage = ((score / questions.length) * 100).toFixed(0);

    return (
      <div className="w-full max-w-xl mx-auto px-4">
        <Card className="shadow-xl border-2 border-primary/20">
          <CardContent className="p-6 md:p-10 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />
              </div>
              <div className="text-4xl md:text-5xl mb-3">{emoji}</div>
              <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${color}`}>{message}</h2>
              <p className="text-muted-foreground text-sm md:text-base">
                {isReview ? 'Quiz Review Completed!' : `You've completed the quiz!`}
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {score}/{questions.length}
              </div>
              <div className="text-lg md:text-xl text-muted-foreground">
                {percentage}% Correct
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  <Home className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/generate" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full bg-linear-to-r from-primary via-purple-600 to-pink-600 hover:opacity-90">
                  <RotateCcw className="w-4 h-4" />
                  Generate New Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Progress Bar - Compact */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Progress
          </span>
          <span className="text-xs font-medium text-primary">
            {currentIdx + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-primary via-purple-600 to-pink-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats - Compact */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <Badge variant="secondary" className="text-xs md:text-sm px-3 py-1.5">
          Question {currentIdx + 1}
        </Badge>
        <Badge className="text-xs md:text-sm px-3 py-1.5 bg-linear-to-r from-primary to-purple-600">
          Score: {score}
        </Badge>
      </div>

      {/* Question Card - Reduced Size */}
      <Card className={`shadow-lg transition-all duration-300 ${
        showResult 
          ? isCorrect 
            ? 'border-2 border-green-500 shadow-green-500/20' 
            : 'border-2 border-red-500 shadow-red-500/20'
          : 'border-2 border-primary/20'
      }`}>
        <CardHeader className="bg-linear-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-b p-4">
          <CardTitle className="text-base md:text-lg leading-snug">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-4">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isAnswer = opt === q.answer;
            
            let buttonStyle = "border-2 ";
            if (showResult && isAnswer) {
              buttonStyle += "border-green-500 bg-green-500/10 hover:bg-green-500/20 text-green-700 dark:text-green-400";
            } else if (showResult && isSelected && !isAnswer) {
              buttonStyle += "border-red-500 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400";
            } else if (showResult) {
              buttonStyle += "border-border opacity-50";
            } else {
              buttonStyle += "border-border hover:border-primary/50 hover:bg-primary/5";
            }

            return (
              <Button
                key={i}
                variant="outline"
                className={`w-full justify-start text-left h-auto py-2.5 md:py-3 px-3 md:px-4 text-xs md:text-sm transition-all ${buttonStyle}`}
                onClick={() => handleSelect(opt)}
                disabled={answered[currentIdx]}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                    showResult && isAnswer 
                      ? 'bg-green-500 text-white' 
                      : showResult && isSelected && !isAnswer
                      ? 'bg-red-500 text-white'
                      : 'bg-muted'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-1 break-words">{opt}</div>
                  {showResult && isAnswer && <CheckCircle2 className="shrink-0 w-5 h-5 text-green-500" />}
                  {showResult && isSelected && !isAnswer && <XCircle className="shrink-0 w-5 h-5 text-red-500" />}
                </div>
              </Button>
            );
          })}
          
          {/* Feedback and Next Button - Inside Card */}
          {showResult && (
            <div className="mt-3 pt-3 border-t space-y-2">
              <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                <p className={`font-semibold text-sm md:text-base text-center ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!isCorrect && (
                  <p className="text-xs mt-1 text-muted-foreground text-center">
                    The correct answer was: <span className="font-semibold text-green-600 dark:text-green-400">{q.answer}</span>
                  </p>
                )}
              </div>
              
              <Button 
                onClick={goNext} 
                size="lg" 
                className="w-full gap-2 bg-linear-to-r from-primary via-purple-600 to-pink-600 hover:opacity-90 text-sm md:text-base py-5"
              >
                {isLast ? (
                  <>
                    <Trophy className="w-5 h-5" />
                    Finish Quiz
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

