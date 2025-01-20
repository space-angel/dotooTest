import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables')
}

const JWT_SECRET = process.env.JWT_SECRET

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
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('Tasks fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST 요청 처리
export async function POST(request: Request) {
  try {
    // 인증 확인
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "로그인이 필요합니다." }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    let userId: string
    try {
      const verified = jwt.verify(token.value, JWT_SECRET) as { userId: string }
      userId = verified.userId
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ message: "유효하지 않은 인증 토큰입니다." }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const text = await request.text()
    if (!text) {
      return new NextResponse(
        JSON.stringify({ message: "요청 본문이 비어있습니다." }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const payload = JSON.parse(text)
    const { title, spaceId, taskType, assignedTo, dueDate, environment } = payload

    // 필수 필드 검사
    if (!title || !spaceId || !taskType || !assignedTo || !dueDate) {
      return new NextResponse(
        JSON.stringify({ 
          message: "필수 필드가 누락되었습니다.",
          missingFields: {
            title: !title,
            spaceId: !spaceId,
            taskType: !taskType,
            assignedTo: !assignedTo,
            dueDate: !dueDate
          }
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

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

    return new NextResponse(
      JSON.stringify(task),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error: any) {
    console.error('Task creation error:', error)
    return new NextResponse(
      JSON.stringify({ 
        message: "할일 생성에 실패했습니다.",
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 