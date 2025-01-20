import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { headers } from 'next/headers'
import prisma from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Prisma } from "@prisma/client"

// GET 요청 처리
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const environment = req.headers.get('x-environment') || 'test1'

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        environment: environment
      },
      include: {
        space: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("할일 조회 에러:", error)
    return NextResponse.json(
      { error: "할일을 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST 요청 처리
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }

    const headersList = await headers()
    const environment = headersList.get('x-environment')
    
    // 환경 값 검증
    if (environment !== 'test1' && environment !== 'test2') {
      return NextResponse.json(
        { error: "유효하지 않은 환경입니다." },
        { status: 400 }
      )
    }

    const body = await req.json()
    
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || "",
        dueDate: new Date(body.dueDate),
        assignedTo: body.assignedTo || "",
        spaceId: body.spaceId,
        taskType: body.taskType,
        userId: session.user.id,
        environment: environment
      },
      include: {
        space: true
      }
    })

    console.log('Created task:', {
      id: task.id,
      title: task.title,
      environment: task.environment
    })

    return NextResponse.json({ 
      message: "할일이 성공적으로 추가되었습니다.",
      task 
    })
  } catch (error) {
    console.error("할일 생성 에러:", error)
    return NextResponse.json(
      { error: "할일을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 