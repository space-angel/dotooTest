export interface Space {
  id: string;
  name: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;  // ISO string 형식
  assignedTo: string | null;  // null 허용
  userId: string;
  isCompleted: boolean;
  space: Space | null;
  taskType: string | null;
  spaceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember {
  id: string
  name: string
}

export interface ExperimentSpace {
  id: string
  name: string
  icon: string
}

export interface ExperimentTask {
  id: string;
  spaceId: string;
  level: string;
  title: string;
  taskType?: string;
  dueDate?: string;
  assignedTo?: string;
  environment?: string;
}

export interface ExperimentUser {
  id: string
  name: string
  image: string | null
}

export interface TaskData {
  title: string;
  spaceId: string;
  taskType: string;
  assignedTo: string;
  dueDate: string;
  environment: string;
  description?: string | null;
  userId?: string;
} 