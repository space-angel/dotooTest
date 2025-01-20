'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, startOfDay, isSameDay } from 'date-fns'
import { EXPERIMENT2_SPACES, EXPERIMENT2_USERS } from '@/constants/experiment2'
import Navbar from '@/components/Navbar'
import WeeklyCalendar from '@/components/WeeklyCalendar'
import type { ExperimentTask } from '@/types/task'

// API 응답 데이터 타입 정의
interface TaskResponse {
  tasks: Array<{
    id: string;
    title: string;
    spaceId: string;
    taskType: string;
    dueDate: string;
    assignedTo: string;
  }>;
}

// TasksBySpace 타입 정의
interface TasksBySpace {
  [key: string]: ExperimentTask[];
}

export default function ExperimentPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  // 나중에 사용할 상태들은 주석 처리
  // const [selectedTask, setSelectedTask] = useState<string | null>(null)
  // const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [tasks, setTasks] = useState<ExperimentTask[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks', {
          credentials: 'include'
        })

        if (response.status === 401) {
          router.push('/login')
          return
        }

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
  }, [router])

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // 선택된 날짜의 tasks 필터링
  const selectedDateTasks = tasks.filter(task => {
    if (!task?.dueDate) return false;
    
    // timezone을 고려한 날짜 비교
    const taskDate = startOfDay(new Date(task.dueDate));
    const compareDate = startOfDay(selectedDate);
    return isSameDay(taskDate, compareDate);
  });

  console.log('선택된 날짜의 tasks:', selectedDateTasks);

  // TODO: 날짜 선택 기능 구현 예정
  // const _handleDateSelect = (date: Date) => {
  //   setSelectedDate(date);
  //   console.log('Selected new date:', format(date, 'yyyy-MM-dd'));
  // };

  // TODO: 할일 저장 기능 구현 예정
  // const _handleSaveTask = async () => {
  //   if (!selectedTask || !selectedDate) return;

  //   const [spaceId, level] = selectedTask.split('-');
  //   const taskData = tasks[spaceId]?.find((t: ExperimentTask) => t.level === level.toUpperCase());
    
  //   if (!taskData) return;

  //   try {
  //     const response = await fetch('/api/tasks', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Environment': 'test2',
  //       },
  //       body: JSON.stringify({
  //         title: taskData.title,
  //         spaceId: taskData.spaceId,
  //         taskType: taskData.id,
  //         assignedTo: selectedUsers.join(','),
  //         dueDate: format(selectedDate, 'yyyy-MM-dd'),
  //         environment: 'test2'
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('할일 저장 실패');
  //     }

  //     setSelectedTask(null);
  //     setSelectedUsers([]);
  //     setSelectedDate(new Date());
      
  //     fetchTasks();
  //   } catch (error) {
  //     console.error('Error saving task:', error);
  //     alert('할일 저장에 실패했습니다.');
  //   }
  // };

  // TODO: 할일 삭제 기능 구현 예정
  // const _handleDeleteTask = async (taskId: string) => {
  //   try {
  //     const response = await fetch(`/api/tasks/${taskId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Environment': 'test2'
  //       }
  //     });

  //     if (!response.ok) {
  //       throw new Error('할일 삭제 실패');
  //     }

  //     fetchTasks();
  //   } catch (error) {
  //     console.error('Error deleting task:', error);
  //     alert('할일 삭제에 실패했습니다.');
  //   }
  // };

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