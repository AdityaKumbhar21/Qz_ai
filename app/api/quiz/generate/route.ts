import { prisma } from "@/lib/prisma";
import { generateQuiz } from "@/lib/quizGenerator";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({
                message:"Unauthorized",
            }, {status:400})
    }
    const { topic, difficulty } = await request.json() as {topic:string; difficulty:string};

    try {
        const questions = await generateQuiz({topic, difficulty})

        if(questions){
            const user = await prisma.user.findFirst({
                where: {clerkId: userId}
            });

            if(!user){
                return NextResponse.json({
                message:"User not found"
            }, {status:404})
            }

            const quiz = await prisma.quiz.create({
                data:{
                    userId: user.id as string,
                    topic,
                    difficulty,
                    score: 0,
                    total: 10,
                    questions,
                }
            })

            

            const fe_questions = questions.map((q:any)=>({
                question: q.question,
                options: q.options,
                answer: q.answer
            }))

            return NextResponse.json({
                message:"Quiz generated successfully",
                quizId: quiz.id,
                topic,
                difficulty,
                questions: fe_questions
            }, {status:200})
        }


    } catch (error) {
        console.log("Quiz generation error: ", error);
        return NextResponse.json({
                message:"Internal Server error",
            }, {status:500})
        
    }
}