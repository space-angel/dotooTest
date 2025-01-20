'use client'

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* 바텀 시트 */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 transform transition-transform duration-300 ease-in-out"
        style={{
          maxHeight: '480px', // 전체 높이의 약 70%
        }}
      >
        <div className="w-full p-4">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
          {children}
        </div>
      </div>
    </>
  );
} 