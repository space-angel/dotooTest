'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginContent() {
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email') as string
      const password = formData.get('password') as string

      console.log('로그인 시도:', { email })

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()
      console.log('로그인 응답:', data)

      if (!response.ok) {
        throw new Error(data.error || '로그인에 실패했습니다.')
      }

      if (data.success) {
        try {
          window.location.href = '/test-environment'
        } catch (error) {
          console.error('라우팅 에러:', error)
          throw new Error('페이지 이동 중 오류가 발생했습니다.')
        }
      } else {
        throw new Error('로그인 응답이 올바르지 않습니다.')
      }
    } catch (error) {
      console.error('로그인 에러:', error)
      throw error
    }
  }

  return (
    <div className="min-h-[680px] flex items-center justify-center px-4">
      <div className="w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center">로그인</h2>
          {registered && (
            <p className="mt-2 text-sm text-center text-green-600">
              회원가입이 완료되었습니다. 로그인해주세요.
            </p>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error === 'credentials' ? '이메일 또는 비밀번호가 올바르지 않습니다.' : error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md
              ${isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
              }`}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          계정이 없으신가요?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
} 