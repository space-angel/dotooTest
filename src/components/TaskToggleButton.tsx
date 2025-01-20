interface TaskToggleButtonProps {
  taskId: string;
  isCompleted: boolean;
  onToggle?: (taskId: string) => void;
}

export default function TaskToggleButton({
  taskId,
  isCompleted,
  onToggle
}: TaskToggleButtonProps) {
  return (
    <button
      onClick={() => onToggle?.(taskId)}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-colors duration-200
        ${isCompleted 
          ? 'bg-blue-500 border-blue-500' 
          : 'border-gray-300 hover:border-blue-500'
        }`}
    >
      {isCompleted && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 text-white" 
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
  );
}