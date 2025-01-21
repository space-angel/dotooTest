import prisma from "../../lib/prisma"
import DashboardView from "./DashboardView"
import type { Task } from "../../types/task"
import type { Prisma } from '@prisma/client'

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

  // Prisma 타입 정의
  type TaskWithSpace = Prisma.TaskGetPayload<{
    include: { space: true }
  }>

  const serializedTasks: Task[] = tasks.map((task: TaskWithSpace) => ({
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