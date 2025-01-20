import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
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
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    let userId: string
    try {
      const verified = jwt.verify(token.value, JWT_SECRET) as { userId: string }
      userId = verified.userId
    } catch {
      return NextResponse.json(
        { message: "유효하지 않은 인증 토큰입니다." },
        { status: 401 }
      )
    }

    const text = await request.text()
    if (!text) {
      return NextResponse.json(
        { message: "요청 본문이 비어있습니다." },
        { status: 400 }
      )
    }

    let payload: TaskData
    try {
      payload = JSON.parse(text) as TaskData
    } catch {
      return NextResponse.json(
        { message: "잘못된 JSON 형식입니다." },
        { status: 400 }
      )
    }

    const { title, spaceId, taskType, assignedTo, dueDate, environment } = payload

    // Task 생성
    const task = await prisma.task.create({
      data: {
        title,
        spaceId,
        taskType,
        assignedTo,
        dueDate: new Date(dueDate),
        environment,
        userId
      }
    })

    return NextResponse.json(task, { status: 201 })

  } catch {
    return NextResponse.json(
      { message: "할일 생성에 실패했습니다." },
      { status: 500 }
    )
  }
} 