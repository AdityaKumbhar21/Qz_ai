// app/quiz/[id]/page.tsx
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import FlashCardQuiz from '@/components/FlashCardQuiz';

export default async function QuizPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return <div>Sign in to continue</div>;

  const dbUser = await prisma.user.findFirst({ where: { clerkId: user.id } });
  const quiz = await prisma.quiz.findFirst({
    where: { id: params.id },
    select: { id: true, questions: true, userId: true },
  });

  if (!quiz || quiz.userId !== dbUser?.id) return <div>Quiz not found</div>;

  const safeQuestions = (quiz.questions as any[]).map((q: any) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    answer: q.answer, // keep on server, send to client only when needed
  }));

  return <FlashCardQuiz quizId={quiz.id} questions={safeQuestions} />;
}