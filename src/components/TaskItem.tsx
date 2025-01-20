import { useState, useRef, useEffect } from 'react';
import TaskToggleButton from './TaskToggleButton'
import { Space, FamilyMember } from '@/types/task'
import useOutsideClick from '@/hooks/useOutsideClick';
import { format } from 'date-fns';

interface TaskItemProps {
  id: string;
  title: string;
  assignedTo: string | null;
  dueDate: string;
  isCompleted: boolean;
  space: Space | null;
  onToggleComplete?: (taskId: string) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
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
  
  useEffect(() => {
    if (!dropdownRef.current) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const assignedMember = assignedTo || "미배정";

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm flex justify-between items-start
      transition-all duration-300 ease-in-out
      ${isCompleted ? 'opacity-60 bg-gray-50' : ''}`}>
      <div className="flex items-center gap-3">
        <TaskToggleButton 
          taskId={id}
          isCompleted={isCompleted}
          onToggle={onToggleComplete}
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
              {title}
            </h3>
            {space && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {space.name}
              </span>
            )}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {assignedMember}
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