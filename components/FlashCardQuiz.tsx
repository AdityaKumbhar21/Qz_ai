'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

type Question = {
  id: number;
  question: string;
  options: string[];
  answer: string;
};

export default function FlashCardQuiz({ quizId, questions }: { quizId: string; questions: Question[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<boolean[]>(new Array(questions.length).fill(false));

  const q = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const isCorrect = selected === q.answer;

  const handleSelect = (opt: string) => {
    if (answered[currentIdx]) return;
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
      submitScore();
    } else {
      setCurrentIdx(i => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const submitScore = async () => {
    await fetch(`/api/quiz/${quizId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finalScore: score }),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Badge variant="secondary">Question {currentIdx + 1} / {questions.length}</Badge>
        <Badge>Score: {score}</Badge>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{q.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt;
            const isAnswer = opt === q.answer;

            return (
              <Button
                key={i}
                variant={
                  showResult && isAnswer
                    ? 'default'
                    : showResult && isSelected && !isAnswer
                    ? 'destructive'
                    : 'outline'
                }
                className="w-full justify-start text-left"
                onClick={() => handleSelect(opt)}
                disabled={answered[currentIdx]}
              >
                {showResult && isAnswer && <CheckCircle2 className="mr-2 h-4 w-4" />}
                {showResult && isSelected && !isAnswer && <XCircle className="mr-2 h-4 w-4" />}
                {opt}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {showResult && (
        <div className="mt-6 text-center">
          <Button onClick={goNext} size="lg">
            {isLast ? 'Finish & Save Score' : 'Next Question'} <ChevronRight className="ml-2" />
          </Button>
        </div>
      )}

      {isLast && showResult && (
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-bold">Final Score: {score} / {questions.length}</h2>
        </div>
      )}
    </div>
  );
}