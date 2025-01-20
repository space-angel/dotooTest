import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const JWT_SECRET = process.env.JWT_SECRET

interface RouteParams {
  params: {
    taskId: string
  }
}

// PATCH 메서드
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const verified = jwt.verify(token.value, JWT_SECRET) as { userId: string };
      userId = verified.userId;
    } catch {
      return NextResponse.json(
        { message: "유효하지 않은 인증 토큰입니다." },
        { status: 401 }
      );
    }

    const { isCompleted } = await request.json();

    const task = await prisma.task.update({
      where: {
        id: params.taskId,
        userId
      },
      data: {
        isCompleted
      }
    });

    return NextResponse.json({ task }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "할일 업데이트에 실패했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 메서드
export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const verified = jwt.verify(token.value, JWT_SECRET) as { userId: string };
      userId = verified.userId;
    } catch {
      return NextResponse.json(
        { message: "유효하지 않은 인증 토큰입니다." },
        { status: 401 }
      );
    }

    const task = await prisma.task.delete({
      where: {
        id: params.taskId,
        userId
      }
    });

    return NextResponse.json(
      { message: "할일이 삭제되었습니다.", task },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "할일 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
} 