import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호를 입력해주세요." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "이메일 또는 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성 시 보안 옵션 강화
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { 
        expiresIn: '1d',
        algorithm: 'HS256'  // 명시적 알고리즘 설정
      }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

    // 쿠키 설정 강화
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: true,  // HTTPS에서만 작동
      sameSite: 'strict',  // CSRF 방지
      maxAge: 86400,
      path: '/',
      domain: process.env.NEXT_PUBLIC_DOMAIN  // 배포 도메인 설정
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 