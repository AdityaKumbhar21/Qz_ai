import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        {
          message: "Quiz not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Quiz fetched successfully",
        quiz,
      },
      { status: 200 }
    );
  } catch (error) {
    // Don't log error details in production
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const quiz = await prisma.quiz.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!quiz) {
      return NextResponse.json(
        {
          message: "Quiz not found",
        },
        { status: 404 }
      );
    }

    if(quiz.userId !== user.id) {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    await prisma.quiz.delete({
      where: {
        id: quiz.id,
      },
    });

    return NextResponse.json(
      {
        message: "Quiz deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    // Don't log error details in production
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
