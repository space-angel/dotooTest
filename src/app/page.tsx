import { redirect } from 'next/navigation'
import { TaskData } from '@/types/task'

export default function Home() {
  redirect('/login')
}
