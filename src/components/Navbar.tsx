'use client'

import { useRouter } from 'next/navigation'

export default function Navbar() {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('로그아웃 실패')
      }

      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
    }
  }

  return (
    <nav className="w-full h-14 bg-white border-b">
      <div className="h-full px-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">두잇투게더 UT</h1>
        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          로그아웃
        </button>
      </div>
    </nav>
  )
} 