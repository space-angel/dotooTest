'use client'

import { useState, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import BottomSheet from '../../../../../components/BottomSheet'
import { EXPERIMENT2_SPACES, EXPERIMENT2_TASKS, EXPERIMENT2_USERS } from '../../../../../constants/experiment2'

interface PageProps {
  params: Promise<{
    spaceId: string
  }>
}

export default function NewTaskPage({ params }: PageProps) {
  const { spaceId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date')
  
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [showUserSelect, setShowUserSelect] = useState(false)

  const space = EXPERIMENT2_SPACES.find((s) => s.id === spaceId)
  if (!space) return null

  const tasks = EXPERIMENT2_TASKS[spaceId] || []

  // 선택된 레벨에 따른 활성화된 레벨들을 반환하는 함수
  const getActiveLevels = (level: string) => {
    switch(level.toLowerCase()) {
      case 'min':
        return ['min'];
      case 'more':
        return ['min', 'more'];
      case 'max':
        return ['min', 'more', 'max'];
      default:
        return [];
    }
  }

  const handleSave = async () => {
    if (!selectedLevel || !dateParam || !selectedUser) {
      alert('모든 필수 항목을 선택해주세요.')
      return
    }

    try {
      // 현재 로그인된 사용자의 ID를 가져옵니다
      const authResponse = await fetch('/api/check-session')
      const authData = await authResponse.json()
      
      if (!authData.authenticated || !authData.user?.userId) {
        alert('로그인이 필요합니다.')
        router.push('/login')
        return
      }

      const task = tasks.find(t => t.level === selectedLevel)
      if (!task) {
        alert('선택된 할일 정보를 찾을 수 없습니다.')
        return
      }

      const payload = {
        title: task.title,
        spaceId: task.spaceId,
        taskType: task.id,
        assignedTo: selectedUser,
        dueDate: `${dateParam}T00:00:00.000Z`,
        environment: 'test2',
        userId: authData.user.userId  // 사용자 ID 추가
      }

      // 페이로드 유효성 검사 추가
      if (!payload.title || !payload.spaceId || !payload.taskType || !payload.assignedTo || !payload.dueDate) {
        console.error('유효하지 않은 페이로드:', payload)
        alert('필수 데이터가 누락되었습니다.')
        return
      }

      console.log('전송하는 데이터:', JSON.stringify(payload)) // stringify된 데이터 확인

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      let data
      let errorMessage = '할일을 저장하는 중 오류가 발생했습니다.'

      const textResponse = await response.text()
      console.log('서버 응답 텍스트:', textResponse)

      if (textResponse) {
        try {
          data = JSON.parse(textResponse)
        } catch (e) {
          console.error('JSON 파싱 에러:', e)
        }
      }

      if (!response.ok) {
        errorMessage = data?.message || errorMessage
        console.error('서버 응답 상태:', response.status)
        console.error('에러 메시지:', errorMessage)
        alert(errorMessage)
        return
      }

      router.push('/experiment')
      router.refresh()
    } catch (error) {
      console.error('Error saving task:', error)
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.')
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    setShowUserSelect(false)
  }

  return (
    <div className="w-[390px] h-[680px] relative mx-auto bg-white overflow-hidden">
      <div className="h-14 px-4 flex items-center border-b">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold ml-2">새로운 할 일</h1>
      </div>

      <div className="p-4 space-y-6 overflow-auto h-[calc(680px-56px-72px)]">
        <div>
          <h3 className="font-medium mb-4">{space.name} 할 일</h3>
          <div className="space-y-3">
            {tasks.map((task) => {
              const activeLevels = selectedLevel ? getActiveLevels(selectedLevel) : []
              const isActive = activeLevels.includes(task.level.toLowerCase())
              const isSelected = selectedLevel === task.level
              
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedLevel(task.level)}
                  className={`
                    w-full p-4 rounded-lg text-left border transition-all
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-500 text-white' 
                      : isActive
                        ? 'border-emerald-500 bg-emerald-50 text-gray-900'
                        : 'border-gray-200 text-gray-500'
                    }
                  `}
                >
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">
                        {task.level.toUpperCase()}
                      </div>
                      <div className={`text-sm whitespace-pre-line ${
                        isSelected 
                          ? 'text-white' 
                          : isActive 
                            ? 'text-gray-900' 
                            : 'text-gray-500'
                      }`}>
                        {task.title}
                      </div>
                    </div>
                    {(isSelected || isActive) && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 ${isSelected ? 'text-white' : 'text-emerald-500'}`}
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {selectedLevel && (
          <div>
            <button
              onClick={() => setShowUserSelect(true)}
              className="w-full p-4 rounded-lg border border-gray-200 text-left hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600">담당자 선택</span>
                <span className="text-sm text-gray-400">
                  {selectedUser ? EXPERIMENT2_USERS.find(u => u.id === selectedUser)?.name : '+ 선택하기'}
                </span>
              </div>
            </button>
          </div>
        )}

        {showUserSelect && (
          <BottomSheet isOpen={showUserSelect} onClose={() => setShowUserSelect(false)}>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">담당자 선택</h3>
              <div className="space-y-2">
                {EXPERIMENT2_USERS.map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className={`w-full p-3 text-left rounded-lg ${
                      selectedUser === user.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
          </BottomSheet>
        )}

        {selectedLevel && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
            <button
              onClick={handleSave}
              className="w-full p-4 rounded-lg bg-emerald-500 text-white font-medium"
            >
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 