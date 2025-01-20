'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TestEnvironmentSelect() {
  const [selectedEnv, setSelectedEnv] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedEnv) {
      alert('테스트 환경을 선택해주세요')
      return
    }
    
    // 선택된 환경을 세션스토리지에 저장
    sessionStorage.setItem('testEnvironment', selectedEnv)
    
    // 환경에 따라 다른 페이지로 이동
    if (selectedEnv === 'test1') {
      router.push('/dashboard')
    } else if (selectedEnv === 'test2') {
      router.push('/experiment')  // test2 환경은 experiment 페이지로 이동
    }
  }

  return (
    <div className="min-h-[680px] flex items-center px-4">
      <div className="w-full space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-center">테스트 환경 선택</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              테스트 환경
            </label>
            <select 
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">환경을 선택하세요</option>
              <option value="test1">테스트 A (독립 대시보드)</option>
              <option value="test2">테스트 B (그룹화)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            계속하기
          </button>
        </form>
      </div>
    </div>
  )
} 