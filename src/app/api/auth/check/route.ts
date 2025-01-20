import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 여기에 실제 사용하시는 인증 로직을 구현하시면 됩니다
    // 예: 세션 쿠키 확인, JWT 토큰 확인 등
    return NextResponse.json({ isAuthenticated: false });
  } catch {
    return NextResponse.json({ isAuthenticated: false });
  }
} 