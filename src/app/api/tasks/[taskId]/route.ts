import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { type NextApiRequest } from "next"

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface RouteParams {
  params: {
    taskId: string
  }
}

// PATCH 메서드
export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const verified = jwt.verify(token.value, JWT_SECRET) as { userId: string };
    const { isCompleted } = await req.json();

    const updatedTask = await prisma.task.update({
      where: {
        id: params.taskId,
        userId: verified.userId,
      },
      data: {
        isCompleted,
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('할일 업데이트 중 오류:', error);
    return NextResponse.json(
      { error: "할일을 업데이트하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 메서드
export async function DELETE(
  _req: NextRequest,
  context: RouteParams
) {
  try {
    const taskId = context.params.taskId

    const task = await prisma.task.delete({
      where: {
        id: taskId
      }
    })

    return NextResponse.json(task)
  } catch (err) {
    console.error("Task deletion error:", err)
    return new NextResponse("작업 삭제 중 오류가 발생했습니다.", { status: 500 })
  }
} 