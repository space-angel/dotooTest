import prisma from "../../lib/prisma"
import DashboardView from "./DashboardView"
import type { Task } from "../../types/task"

interface PrismaTask {
  id: string
  title: string
  description: string | null
  dueDate: Date
  isCompleted: boolean
  assignedTo: string | null
  userId: string
  spaceId: string
  taskType: string | null
  space: {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

export default async function DashboardPage() {
  const tasks = await prisma.task.findMany({
    where: {
      environment: 'test1'
    },
    include: {
      space: true
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  const serializedTasks: Task[] = tasks.map((task: PrismaTask) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.dueDate.toISOString(),
    isCompleted: task.isCompleted,
    assignedTo: task.assignedTo,
    userId: task.userId,
    spaceId: task.spaceId,
    taskType: task.taskType,
    space: task.space,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  }))

  return <DashboardView initialTasks={serializedTasks} />
}  