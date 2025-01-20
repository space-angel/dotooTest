import { NextResponse } from "next/server"
import prisma from '../../../lib/prisma'

const SPACES = [
  { id: 'living', name: '거실' },
  { id: 'kitchen', name: '주방' },
  { id: 'bathroom', name: '화장실' },
  { id: 'bedroom', name: '침실' },
]

export async function POST() {
  try {
    const spaces = await Promise.all(
      SPACES.map(space => 
        prisma.space.upsert({
          where: { id: space.id },
          update: {},
          create: space,
        })
      )
    )

    return NextResponse.json({ 
      message: "공간 데이터가 초기화되었습니다.",
      spaces 
    })
  } catch (error) {
    console.error("공간 데이터 초기화 에러:", error)
    return NextResponse.json(
      { error: "공간 데이터 초기화 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
} 