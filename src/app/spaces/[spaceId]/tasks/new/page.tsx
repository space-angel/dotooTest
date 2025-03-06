'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { EXPERIMENT2_SPACES, EXPERIMENT2_TASKS, EXPERIMENT2_USERS } from '../../../../../constants/experiment2'
import Navbar from '@/components/Navbar'

interface PageProps {
  params: Promise<{
    spaceId: string
  }>
  searchParams: {
    date?: string
    [key: string]: string | string[] | undefined
  }
}

export default function NewTaskPage(props: PageProps) {
  const params = use(props.params)
  const { spaceId } = params
  const selectedDate = props.searchParams.date
  const router = useRouter()

  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [showUserSelect, setShowUserSelect] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const space = EXPERIMENT2_SPACES.find((s) => s.id === spaceId)
  if (!space) return null

  const tasks = EXPERIMENT2_TASKS[spaceId] || []

  const getActiveLevels = (level: string) => {
    switch (level.toLowerCase()) {
      case 'min':
        return ['min']
      case 'more':
        return ['min', 'more']
      case 'max':
        return ['min', 'more', 'max']
      default:
        return []
    }
  }

  const handleSave = async () => {
    if (!selectedLevel || !selectedUser) {
      alert('모든 필수 항목을 선택해주세요.')
      return
    }

    setIsLoading(true)

    try {
      const authResponse = await fetch('/api/check-session')
      const authData = await authResponse.json()

      if (!authData.authenticated || !authData.user?.userId) {
        alert('로그인이 필요합니다.')
        router.push('/login')
        return
      }

      const task = tasks.find((t) => t.level === selectedLevel)
      if (!task) {
        alert('선택된 할일 정보를 찾을 수 없습니다.')
        return
      }

      const payload = {
        title: task.title,
        spaceId: task.spaceId,
        taskType: task.id,
        assignedTo: selectedUser,
        dueDate: selectedDate || new Date().toISOString().split('T')[0],
        environment: 'test2',
        userId: authData.user.userId,
      }

      if (
        !payload.title ||
        !payload.spaceId ||
        !payload.taskType ||
        !payload.assignedTo ||
        !payload.dueDate
      ) {
        console.error('유효하지 않은 페이로드:', payload)
        alert('필수 데이터가 누락되었습니다.')
        return
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(errorData.message || '할일 저장에 실패했습니다.')
        return
      }

      router.push('/experiment')
      router.refresh()
    } catch (error) {
      console.error('Error saving task:', error)
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId)
    setShowUserSelect(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">새로운 할일</h1>

        <div className="space-y-6">
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
                    className={`w-full p-4 rounded-lg text-left border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isActive
                        ? 'border-emerald-500 bg-emerald-50 text-gray-900'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="text-sm font-medium mb-1">{task.level.toUpperCase()}</div>
                        <div
                          className={`text-sm whitespace-pre-line ${
                            isSelected
                              ? 'text-white'
                              : isActive
                              ? 'text-gray-900'
                              : 'text-gray-500'
                          }`}
                        >
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

          <div>
            <h3 className="font-medium mb-2">담당자 선택</h3>
            <div className="relative">
              <button
                onClick={() => setShowUserSelect(!showUserSelect)}
                className="w-full p-3 border rounded-lg text-left flex justify-between items-center"
              >
                {selectedUser ? EXPERIMENT2_USERS.find(u => u.id === selectedUser)?.name : '담당자 선택'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showUserSelect && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                  {EXPERIMENT2_USERS.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user.id)}
                      className="w-full p-3 text-left hover:bg-gray-50"
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
          >
            {isLoading ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
