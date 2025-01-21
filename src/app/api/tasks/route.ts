import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { TaskData } from '@/types/task'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const JWT_SECRET = process.env.JWT_SECRET

// GET 요청 처리
export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: {
        environment: 'test2'
      },
      include: {
        space: true
      }
    })

    return NextResponse.json({ tasks }, { status: 200 })
  } catch {
    return NextResponse.json(
      { message: "할일 목록을 가져오는데 실패했습니다." }, 
      { status: 500 }
    )
  }
}

// POST 요청 처리
export async function POST(request: Request) {
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

    const payload = (await request.json()) as TaskData;
    
    if (!payload.title || !payload.spaceId || !payload.taskType || !payload.dueDate || !payload.environment) {
      return NextResponse.json(
        { message: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title: payload.title,
        spaceId: payload.spaceId,
        taskType: payload.taskType,
        assignedTo: payload.assignedTo ?? null,
        dueDate: new Date(payload.dueDate),
        environment: payload.environment,
        description: payload.description ?? null,
        userId: userId,  // 토큰에서 추출한 userId 사용
        isCompleted: false
      },
      include: {
        space: true
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Task 생성 에러:', error);
    return NextResponse.json(
      { message: "할일 생성에 실패했습니다." },
      { status: 500 }
    );
  }
} 