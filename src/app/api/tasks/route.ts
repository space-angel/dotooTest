import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { TaskData } from '@/types/task'

// GET 요청 처리
export async function GET() {
  try {
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
        userId: 'default-user',  // 임시 userId 설정 또는 필요에 따라 수정
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