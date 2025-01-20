import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 모든 경로 허용
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: []
}; 