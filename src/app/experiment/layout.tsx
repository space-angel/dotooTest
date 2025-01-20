import { redirect } from "next/navigation"
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export default async function ExperimentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')

  if (!token) {
    redirect('/login')
  }

  try {
    // JWT 토큰 검증
    jwt.verify(token.value, JWT_SECRET)
  } catch (error) {
    // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
    redirect('/login')
  }

  return <>{children}</>
} 