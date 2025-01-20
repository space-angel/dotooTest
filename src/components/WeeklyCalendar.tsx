'use client'

import { format, startOfWeek, addDays, isSameDay, getWeek } from 'date-fns'
import { ko } from 'date-fns/locale'

interface WeeklyCalendarProps {
  onDateSelect: (date: Date) => void
  selectedDate: Date
}

export default function WeeklyCalendar({ onDateSelect, selectedDate }: WeeklyCalendarProps) {
  // 이번 주의 시작일을 월요일로 설정
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 })
  
  // 일주일 날짜 배열 생성
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i))
  
  // 현재 주차 계산 (1월 1일 기준)
  const weekNumber = getWeek(selectedDate, { weekStartsOn: 1 })

  return (
    <div className="mb-6">
      <div className="text-sm text-gray-600 mb-2">
        {format(selectedDate, 'yyyy년 MM월', { locale: ko })} {weekNumber}주차
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate)
          const dayLabel = format(day, 'EEE', { locale: ko })
          const dayNumber = format(day, 'd')
          
          return (
            <button
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`
                flex flex-col items-center p-2 rounded-lg
                ${isSelected 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100'
                }
              `}
            >
              <span className="text-xs">{dayLabel}</span>
              <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                {dayNumber}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
} 