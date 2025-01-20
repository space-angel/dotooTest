'use client'

import { useState } from 'react'
import { isSameDay } from 'date-fns'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import WeeklyCalendar from '../../components/WeeklyCalendar'
import TaskItem from '../../components/TaskItem'
import type { Task } from '../../types/task'

const FAMILY_MEMBERS = [
  { id: 'A', name: '김민수' },
  { id: 'B', name: '이영희' },
  { id: 'C', name: '박지수' },
  { id: 'D', name: '최수진' },
]

interface DashboardViewProps {
  initialTasks: Task[];
}

export default function DashboardView({ initialTasks }: DashboardViewProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate)
    const isSameDayMatch = isSameDay(taskDate, selectedDate)
    const isAssigneeMatch = activeFilter === 'all' || task.assignedTo === activeFilter
    
    return isSameDayMatch && isAssigneeMatch
  })

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return

      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted: !task.isCompleted
        })
      })

      if (!res.ok) {
        throw new Error('할일 상태 업데이트 실패')
      }

      const data = await res.json()
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === taskId ? data.task : t
        )
      )
    } catch (error) {
      console.error('할일 상태 업데이트 중 오류:', error)
    }
  }

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!res.ok) {
        throw new Error('할일 삭제 실패')
      }

      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId))
    } catch (error) {
      console.error('할일 삭제 중 오류:', error)
    }
  }

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
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap
                ${activeFilter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              전체
            </button>
            {FAMILY_MEMBERS.map(member => (
              <button
                key={member.id}
                onClick={() => setActiveFilter(member.name)}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap
                  ${activeFilter === member.name
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {member.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredTasks.map(task => (
              <TaskItem 
                key={task.id}
                id={task.id}
                title={task.title}
                assignedTo={task.assignedTo}
                dueDate={task.dueDate}
                isCompleted={task.isCompleted}
                space={task.space}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
              />
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                할일이 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6">
        <Link
          href="/tasks/new"
          className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4v16m8-8H4" 
            />
          </svg>
        </Link>
      </div>
    </div>
  )
} 