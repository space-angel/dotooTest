'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'

export default function TestEnvironmentSelect() {
  const [selectedEnv, setSelectedEnv] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedEnv) {
      alert('테스트 환경을 선택해주세요')
      return
    }
    
    try {
      sessionStorage.setItem('testEnvironment', selectedEnv)
      console.log('페이지 이동 시도:', selectedEnv === 'test1' ? '/dashboard' : '/experiment')
      
      window.location.href = selectedEnv === 'test1' ? '/dashboard' : '/experiment'
    } catch (error) {
      console.error('라우팅 에러:', error)
      alert('페이지 이동 중 오류가 발생했습니다.')
    }
  }

  return (
    <>
      <Navbar />
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
    </>
  )
} 