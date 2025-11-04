import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest, {params}: {params: {id:string}}){

    const {userId} = await auth()

    if(!userId){
        return NextResponse.json({
                message:"Unauthorized",
            }, {status:401})
    }

   try {
        const quiz = await prisma.quiz.findFirst({
            where: {id:params.id}
        })

        if (!quiz || quiz.userId !== (await prisma.user.findFirst({where:{clerkId:userId}}))?.id){
            return NextResponse.json({
                    message:"Quiz not found",
                }, {status:404})
        }

        if(quiz.score > 0) return NextResponse.json({
                    message:"Quiz already submitted",
                }, {status:400})

        
        const {finalScore} = await request.json() as {finalScore:number};
        const {id} = await params
        await prisma.quiz.update({
            where: {id},
            data: {
                score: finalScore
            }
        })
        return NextResponse.json({
                    message:"Quiz submitted successfully",
                }, {status:200})

   } 
   catch (error) {
       console.error("Error submitting quiz: ", error);
       return NextResponse.json({
           message:"Internal Server Error",
       }, {status:500})
   }
        

    
    
}