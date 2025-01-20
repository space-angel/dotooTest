'use client'

import { signOut } from 'next-auth/react'

export default function Navbar() {
  return (
    <nav className="w-full h-14 bg-white border-b">
      <div className="h-full px-4 flex justify-between items-center">
        <h1 className="text-lg font-bold">두잇투게더 UT</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          로그아웃
        </button>
      </div>
    </nav>
  )
} 