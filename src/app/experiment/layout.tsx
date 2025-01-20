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
    jwt.verify(token.value, JWT_SECRET)
  } catch {
    redirect('/login')
  }

  return <>{children}</>
} 