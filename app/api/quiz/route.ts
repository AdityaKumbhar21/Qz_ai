import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({
                message:"Unauthorized",
            }, {status:400})
    }

    try {
        const user = await prisma.user.findUnique({
            where: {clerkId: userId}
        });

        if(!user){
            return NextResponse.json({
            message:"User not found"
        }, {status:404})
        }
        
        const quizzes = await prisma.quiz.findMany({
            where: {userId: user.id},
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json({
            message:"Quizzes fetched successfully",
            quizzes
        }, {status:200})

    } catch (error) {
        // Don't log error details in production
        console.log(error);
        
        return NextResponse.json({
            message:"Internal server error"
        }, {status:500})
    }
}