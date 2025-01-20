import { redirect } from 'next/navigation'
import { TaskData } from '@/types/task'

export default function Home() {
  redirect('/login')
}

const handleSave = async (taskData: TaskData) => {
  try {
    console.log('전송할 데이터:', taskData); // 요청 데이터 로깅

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('서버 응답 상태:', response.status);
      console.error('서버 에러 응답:', errorData);
      console.error('response 전체:', response);
      throw new Error(errorData?.message || '할일 저장 실패');
    }

    const data = await response.json();
    console.log('성공 응답:', data); // 성공 응답 로깅
    return data;
  } catch (error) {
    console.error('상세 에러 정보:', error);
    console.error('에러 스택:', (error as Error).stack);
    throw error;
  }
};
