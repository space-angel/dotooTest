import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const task = await prisma.task.create({
      data: body
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
} 