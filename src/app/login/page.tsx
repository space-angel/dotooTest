'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      console.log('로그인 시도:', { email })

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      console.log('로그인 결과:', {
        ok: result?.ok,
        error: result?.error,
        url: result?.url,
        status: result?.status
      })

      if (result?.error) {
        setError(
          result.error === 'CredentialsSignin' 
            ? '이메일 또는 비밀번호가 일치하지 않습니다.' 
            : result.error
        )
        return
      }

      if (result?.ok) {
        console.log('로그인 성공, 테스트 환경 선택 페이지로 이동')
        await router.push('/test-environment')
        router.refresh()
      }
      
    } catch (error) {
      console.error('로그인 에러:', error)
      setError('로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[680px] flex items-center px-4">
      <div className="w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center">로그인</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="이메일"
              disabled={isLoading}
            />
            <input
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="비밀번호"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
} 