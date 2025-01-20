import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PATCH 메서드
export async function PATCH(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const { isCompleted } = await req.json();

    const updatedTask = await prisma.task.update({
      where: {
        id: params.taskId,
        userId: session.user.id,
      },
      data: {
        isCompleted,
      },
    });

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    console.error('할일 업데이트 중 오류:', error);
    return NextResponse.json(
      { error: "할일을 업데이트하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE 메서드
export async function DELETE(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    await prisma.task.delete({
      where: {
        id: params.taskId,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({ message: '할일이 삭제되었습니다.' });
  } catch (error) {
    console.error('할일 삭제 중 오류:', error);
    return NextResponse.json(
      { error: "할일을 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 