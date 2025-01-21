import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { authenticate } from '../middleware/auth'

// GET 요청 처리
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        space: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Tasks 조회 중 오류:", error)
    return NextResponse.json(
      { error: "Tasks 조회에 실패했습니다." },
      { status: 500 }
    )
  }
}

// POST 요청 처리
export async function POST(request: Request) {
  try {
    const userId = await authenticate()
    const body = await request.json()
    const { title, description, dueDate, assignedTo, spaceId, taskType, environment } = body

    // 필수 필드 검증
    if (!title || !dueDate || !spaceId || !environment) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 }
      )
    }

    // Task 생성
    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        dueDate: new Date(dueDate),
        assignedTo,
        spaceId,
        taskType,
        environment,
        userId,
        isCompleted: false,
      },
      include: {
        space: true,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Task 생성 중 오류:", error)
    return NextResponse.json(
      { error: "Task 생성에 실패했습니다." },
      { status: 500 }
    )
  }
} 