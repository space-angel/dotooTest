'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RegisterFormData {
  email: string
  password: string
  name: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const data: RegisterFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[680px] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-2xl font-bold text-center">회원가입</h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">{error}</div>
          )}
          
          <div className="space-y-4">
            <FormField
              id="email"
              type="email"
              label="이메일"
            />

            <FormField
              id="name"
              type="text"
              label="이름"
            />

            <FormField
              id="password"
              type="password"
              label="비밀번호"
              minLength={6}
              helpText="최소 6자 이상 입력해주세요."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md 
              hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? '처리중...' : '회원가입'}
          </button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

interface FormFieldProps {
  id: string
  type: string
  label: string
  minLength?: number
  helpText?: string
}

function FormField({ id, type, label, minLength, helpText }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        minLength={minLength}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
          shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  )
} 