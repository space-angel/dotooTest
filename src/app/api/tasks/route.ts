import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Session 타입 정의 추가
interface SessionUser {
  user: {
    id: string;
    email?: string;
    name?: string;
  }
}

// GET 요청 처리
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        environment: 'test2'  // test2 환경의 태스크만 가져오기
      },
      include: {
        space: true  // space 정보도 함께 가져오기
      }
    });

    return NextResponse.json({ tasks });  // tasks 배열을 객체로 감싸서 반환
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST 요청 처리
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const task = await prisma.task.create({
      data: {
        ...body,
        userId: session.user.id
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 