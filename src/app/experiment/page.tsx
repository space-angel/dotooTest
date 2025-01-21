'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, startOfDay, isSameDay } from 'date-fns'
import { EXPERIMENT2_SPACES, EXPERIMENT2_USERS } from '../../constants/experiment2'
import Navbar from '../../components/Navbar'
import WeeklyCalendar from '../../components/WeeklyCalendar'
import type { ExperimentTask } from '../../types/task'

export default function ExperimentPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [tasks, setTasks] = useState<ExperimentTask[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks')

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
                <div className="flex items-center space-x-2">
                  {spaceTasks.length > 0 ? (
                    spaceTasks.map((task) => (
                      <div key={task.id} className="flex items-center space-x-1">
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