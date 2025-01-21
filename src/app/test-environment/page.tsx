'use client'

import { useState } from 'react'
import Navbar from '../../components/Navbar'
import { useRouter } from 'next/navigation'

export default function TestEnvironmentSelect() {
  const [selectedEnv, setSelectedEnv] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedEnv) {
      alert('테스트 환경을 선택해주세요')
      return
    }
    
    try {
      sessionStorage.setItem('testEnvironment', selectedEnv)
      console.log('페이지 이동 시도:', selectedEnv === 'test1' ? '/dashboard' : '/experiment')
      
      if (selectedEnv === 'test1') {
        router.push('/dashboard')
      } else if (selectedEnv === 'test2') {
        router.push('/experiment')
      }
    } catch (error) {
      console.error('라우팅 에러:', error)
      alert('페이지 이동 중 오류가 발생했습니다.')
    }
  }

  const handleExperimentSelect = async (experimentId: number) => {
    try {
      // 인증 체크 없이 바로 실험 페이지로 이동
      if (experimentId === 1) {
        router.push('/experiment/1')
      } else if (experimentId === 2) {
        router.push('/experiment/2')
      }
    } catch (error) {
      console.error('Error:', error)
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