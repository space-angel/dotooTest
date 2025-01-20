'use client'

import { useRef, useState } from 'react';
import { format } from 'date-fns';
import { useOutsideClick } from '../hooks/useOutsideClick';
import type { Task } from '../types/task';
import TaskToggleButton from './TaskToggleButton';

interface TaskItemProps {
  id: string;
  title: string;
  assignedTo?: string | null;
  dueDate: string;
  isCompleted?: boolean;
  space?: {
    id: string;
    name: string;
    color?: string;
  } | null;
  onToggleComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskItem({ 
  id,
  title, 
  assignedTo,
  dueDate,
  isCompleted = false,
  space,
  onToggleComplete,
  onDelete
}: TaskItemProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useOutsideClick(dropdownRef as React.RefObject<HTMLElement>, () => setShowDropdown(false));

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b">
      <div className="flex items-center gap-3 flex-1">
        <TaskToggleButton
          taskId={id}
          isCompleted={isCompleted}
          onToggle={onToggleComplete}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isCompleted ? 'text-gray-400 line-through' : ''}`}>
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {space && (
              <span className="text-xs text-gray-500">
                {space.name}
              </span>
            )}
            {assignedTo && (
              <span className="text-xs text-gray-500">
                {assignedTo}
              </span>
            )}
            <span className="text-xs text-gray-500">
              {new Date(dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg py-1 z-10">
            <button
              onClick={() => {
                onDelete?.(id);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 