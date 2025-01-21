import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'
import { authenticate } from '../middleware/auth'

// GET 요청 처리
export async function GET(request: Request) {
  try {
    const userId = await authenticate();  // 현재 로그인한 유저 ID 가져오기
    const { searchParams } = new URL(request.url)
    const environment = searchParams.get('environment') || 'test1'

    console.log('조회하는 환경:', environment)
    console.log('조회하는 유저:', userId)

    const tasks = await prisma.task.findMany({
      where: {
        environment,
        userId, // 현재 로그인한 유저의 tasks만 조회
      },
      include: {
        space: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`${environment} 환경의 Task 수:`, tasks.length)

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Tasks 조회 중 오류:", error)
    if (error instanceof Error && error.message === "로그인이 필요합니다.") {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      )
    }
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
    
    console.log('받은 Task 데이터:', body)

    const { title, description, dueDate, assignedTo, spaceId, taskType, environment } = body

    // 필수 필드 검증 및 로깅
    const missingFields = []
    if (!title) missingFields.push('title')
    if (!dueDate) missingFields.push('dueDate')
    if (!spaceId) missingFields.push('spaceId')
    if (!environment) missingFields.push('environment')

    if (missingFields.length > 0) {
      console.log('누락된 필드들:', missingFields)
      return NextResponse.json(
        { error: `필수 정보가 누락되었습니다: ${missingFields.join(', ')}` },
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
        environment: environment || 'test1',
        userId,
        isCompleted: false,
      },
      include: {
        space: true,
      },
    })

    console.log('생성된 Task:', task)

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Task 생성 중 상세 오류:", error)
    return NextResponse.json(
      { 
        error: "Task 생성에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 