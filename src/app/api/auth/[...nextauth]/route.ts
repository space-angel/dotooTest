import NextAuth, { AuthOptions, DefaultSession, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"

// 세션 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

// JWT 토큰 타입 확장
declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('인증 실패: 자격 증명 누락')
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            console.log('인증 실패: 사용자 없음')
            return null
          }

          const isValid = await compare(credentials.password, user.password)

          if (!isValid) {
            console.log('인증 실패: 비밀번호 불일치')
            return null
          }

          console.log('인증 성공:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name || ""
          }
        } catch (error) {
          console.error('인증 에러:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 