import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "@/app/api/middleware/auth";

// PATCH 메서드
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const userId = await authenticate();
    const { taskId } = await params;

    const body = await request.json();
    const { isCompleted } = body;

    if (typeof isCompleted !== "boolean") {
      return NextResponse.json(
        { message: "isCompleted 값은 boolean 타입이어야 합니다." },
        { status: 400 }
      );
    }

    try {
      const task = await prisma.task.update({
        where: {
          id: taskId,
          userId,
        },
        data: {
          isCompleted,
        },
      });

      return NextResponse.json({ task });
    } catch (error) {
      console.error("Task 업데이트 중 오류:", error);
      return NextResponse.json(
        { message: "할일 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "인증 오류가 발생했습니다.";
    return NextResponse.json(
      { message: errorMessage },
      { status: 401 }
    );
  }
}

// GET 메서드
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Task 조회 중 오류:", error);
    return NextResponse.json(
      { message: "Task 조회에 실패했습니다." },
      { status: 500 }
    );
  }
}