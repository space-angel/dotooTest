import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new NextResponse("필수 정보가 누락되었습니다.", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new NextResponse("이미 등록된 이메일입니다.", { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 12),
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("회원가입 에러:", err);
    return new NextResponse("회원가입 처리 중 오류가 발생했습니다.", { status: 500 });
  }
} 