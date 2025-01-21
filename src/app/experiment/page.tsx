'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { format, startOfDay, isSameDay } from 'date-fns'
import { EXPERIMENT2_SPACES, EXPERIMENT2_USERS } from '../../constants/experiment2'
import Navbar from '../../components/Navbar'
import WeeklyCalendar from '../../components/WeeklyCalendar'
import type { ExperimentTask } from '../../types/task'

export default function ExperimentPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState<ExperimentTask[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks?environment=test2')

        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }

        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (error) {
        console.error('tasks 가져오기 실패:', error)
        setError('할 일을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // ExperimentTask[] 타입의 tasks를 필터링
  const selectedDateTasks = tasks.filter((task: ExperimentTask) => {
    if (!task?.dueDate) return false;
    const taskDate = startOfDay(new Date(task.dueDate));
    const currentDate = startOfDay(selectedDate);
    return isSameDay(taskDate, currentDate);
  });

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('정말 이 할일을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('할일 삭제에 실패했습니다.');
      }

      // 삭제 후 tasks 목록 업데이트
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('할일 삭제 중 오류:', error);
      alert('할일을 삭제하는 중 오류가 발생했습니다.');
    }
  };

  console.log('선택된 날짜의 tasks:', selectedDateTasks);

  return (
    <div className="flex flex-col h-[680px] max-w-[390px] mx-auto relative">
      <Navbar />
      <div className="flex-1 flex flex-col w-full">
        <div className="p-4">
          <WeeklyCalendar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {EXPERIMENT2_SPACES.map((space) => {
          const spaceTasks = selectedDateTasks.filter(task => task.spaceId === space.id);
          
          return (
            <Link
              key={space.id}
              href={`/spaces/${space.id}/tasks/new?date=${format(selectedDate, 'yyyy-MM-dd')}`}
              className="block p-4 border-b hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{space.icon}</span>
                  </div>
                  <span className="font-medium">{space.name}</span>
                </div>
                <div className="flex flex-col space-y-2">
                  {spaceTasks.length > 0 ? (
                    spaceTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {task.level}
                            </span>
                            {task.assignedTo?.split(',').map((userId) => {
                              const user = EXPERIMENT2_USERS.find(u => u.id === userId);
                              return user && (
                                <span key={userId} className="text-sm text-gray-600">
                                  {user.name}
                                </span>
                              );
                            })}
                          </div>
                          <span className="text-xs text-gray-500">
                            {task.taskType}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Link 이벤트 방지
                            handleDeleteTask(task.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">+ 새로운 할 일</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 