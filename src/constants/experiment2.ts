import { TASK_PRESETS } from './tasks'

export const EXPERIMENT2_SPACES = [
  { id: 'living', name: '거실', icon: '💬' },
  { id: 'kitchen', name: '주방', icon: '🏠' },
  { id: 'bathroom', name: '욕실', icon: '🛁' },
  { id: 'bedroom', name: '침실', icon: '🛏️' },
]

export const EXPERIMENT2_USERS = [
  { id: 'A', name: '김민수', image: null },
  { id: 'B', name: '이영희', image: null },
  { id: 'C', name: '박지수', image: null },
  { id: 'D', name: '최수진', image: null },
]

interface Task {
  id: string
  name: string
  level: string
}

interface SpaceTask {
  tasks: Task[]
  name: string
  id: string
}

export const EXPERIMENT2_TASKS = (() => {
  const result: Record<string, Array<{
    id: string
    spaceId: string
    level: string
    title: string
  }>> = {}
  
  EXPERIMENT2_SPACES.forEach(space => {
    const spaceId = space.id
    const spaceTasks = (TASK_PRESETS[spaceId as keyof typeof TASK_PRESETS] as SpaceTask) || { tasks: [] }
    
    result[spaceId] = ['MIN', 'MORE', 'MAX'].map(level => ({
      id: `${spaceId}-${level.toLowerCase()}`,
      spaceId: spaceId,
      level: level,
      title: spaceTasks.tasks
        ?.filter((task: Task) => task.level === level)
        ?.map((task: Task) => task.name)
        ?.join('\n') || ''
    }))
  })
  
  return result
})() 