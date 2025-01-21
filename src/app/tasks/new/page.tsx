'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomSheet from '../../../components/BottomSheet'
import WeeklyCalendar from '../../../components/WeeklyCalendar'
import { getTest1Tasks } from '../../../constants/tasks'

const HOUSE_TASKS = getTest1Tasks()

const SPACES = [
  { id: 'living', name: '거실' },
  { id: 'kitchen', name: '주방' },
  { id: 'bathroom', name: '화장실' },
  { id: 'bedroom', name: '침실' },
]

const FAMILY_MEMBERS = [
  { id: 'A', name: '김민수' },
  { id: 'B', name: '이영희' },
  { id: 'C', name: '박지수' },
  { id: 'D', name: '최수진' },
]

export default function NewTaskPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isTaskTypeOpen, setIsTaskTypeOpen] = useState(false)
  const [isSpaceOpen, setIsSpaceOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState<{ id: string; name: string } | null>(null)
  const [selectedTask, setSelectedTask] = useState<string>('')
  const [isMemberOpen, setIsMemberOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string } | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const handleBack = () => {
    router.back()
  }

  const handleTaskSelect = (taskId: string) => {
    const task = HOUSE_TASKS.find(t => t.id === taskId)
    setSelectedTask(taskId)
    setSelectedSpace(task?.space || null)
    setIsTaskTypeOpen(false)
  }

  const handleSpaceSelect = (spaceId: string) => {
    const space = SPACES.find(s => s.id === spaceId)
    setSelectedSpace(space || null)
    setIsSpaceOpen(false)
  }

  const handleMemberSelect = (memberId: string) => {
    const member = FAMILY_MEMBERS.find(m => m.id === memberId)
    setSelectedMember(member || null)
    setIsMemberOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const selectedTaskData = HOUSE_TASKS.find(t => t.id === selectedTask)
    
    if (!selectedTaskData) {
      alert('할일을 선택해주세요')
      return
    }

    if (!selectedMember) {
      alert('담당자를 선택해주세요')
      return
    }

    setIsLoading(true)

    try {
      const taskData = {
        title: selectedTaskData.name,
        dueDate: selectedDate.toISOString(),
        description: '',
        assignedTo: selectedMember.name,
        spaceId: selectedTaskData.space.id,
        taskType: selectedTask,
        environment: 'test1'
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-environment': 'test1'
        },
        body: JSON.stringify(taskData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '할일 생성에 실패했습니다')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('할일 생성 중 오류가 발생했습니다')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[680px] relative">
      <div className="h-14 px-4 flex items-center border-b">
        <button
          onClick={handleBack}
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

      <div className="p-4">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              할일 선택
            </label>
            <button
              type="button"
              onClick={() => setIsTaskTypeOpen(true)}
              className="w-full px-4 py-2.5 text-left text-sm border rounded-lg hover:bg-gray-50"
            >
              {HOUSE_TASKS.find(t => t.id === selectedTask)?.name || '할일 선택하기'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              담당자
            </label>
            <button
              type="button"
              onClick={() => setIsMemberOpen(true)}
              className="w-full px-4 py-2.5 text-left text-sm border rounded-lg hover:bg-gray-50"
            >
              {selectedMember?.name || '담당자 선택하기'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              마감일
            </label>
            <WeeklyCalendar 
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date)
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedTask}
            className={`w-full py-2.5 text-white rounded-lg 
              ${isLoading || !selectedTask 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>저장 중...</span>
              </div>
            ) : (
              '저장하기'
            )}
          </button>
        </form>
      </div>

      <BottomSheet 
        isOpen={isTaskTypeOpen} 
        onClose={() => setIsTaskTypeOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">어떤 집안일인가요?</h2>
          <div className="overflow-y-auto max-h-[400px] space-y-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">거실</h3>
              {HOUSE_TASKS
                .filter(task => task.space.id === 'living')
                .map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                        {task.space.name}
                      </span>
                    </div>
                    {selectedTask === task.id && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-[#26D6C4]" 
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
                  </button>
                ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">주방</h3>
              {HOUSE_TASKS
                .filter(task => task.space.id === 'kitchen')
                .map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                        {task.space.name}
                      </span>
                    </div>
                    {selectedTask === task.id && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-[#26D6C4]" 
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
                  </button>
                ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">화장실</h3>
              {HOUSE_TASKS
                .filter(task => task.space.id === 'bathroom')
                .map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                        {task.space.name}
                      </span>
                    </div>
                    {selectedTask === task.id && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-[#26D6C4]" 
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
                  </button>
                ))}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">침실</h3>
              {HOUSE_TASKS
                .filter(task => task.space.id === 'bedroom')
                .map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task.id)}
                    className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{task.name}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-xs rounded-full text-gray-600">
                        {task.space.name}
                      </span>
                    </div>
                    {selectedTask === task.id && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-[#26D6C4]" 
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
                  </button>
                ))}
            </div>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={isSpaceOpen} 
        onClose={() => setIsSpaceOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">어느 공간의 할 일인가요?</h2>
          {SPACES.map(space => (
            <button
              key={space.id}
              onClick={() => handleSpaceSelect(space.id)}
              className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <span>{space.name}</span>
              {selectedSpace?.id === space.id && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#26D6C4]" 
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
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={isMemberOpen} 
        onClose={() => setIsMemberOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">담당자를 선택해주세요</h2>
          {FAMILY_MEMBERS.map(member => (
            <button
              key={member.id}
              onClick={() => handleMemberSelect(member.id)}
              className="w-full p-4 text-left hover:bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <span>{member.name}</span>
              {selectedMember?.id === member.id && (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-[#26D6C4]" 
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
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
} 