import { currentUser } from '@clerk/nextjs/server';
import FlashCardQuiz from '@/components/FlashCardQuiz';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import QuizClient from '@/components/QuizClient';

export default async function QuizPage({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) redirect('/sign-in');
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <QuizClient quizId={id} />
    </div>
  );
}

