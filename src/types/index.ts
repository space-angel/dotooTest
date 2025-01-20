export interface Space {
  id: string;
  name: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date;
  isCompleted: boolean;
  assignedTo?: string | null;
  userId: string;
  spaceId?: string | null;
  taskType?: string | null;
  environment: string;
  space?: Space | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  image?: string;
}

export interface ExperimentTask {
  id: string;
  spaceId: string;
  level: string;
  title: string;
  taskType: string;
  dueDate?: string;
  assignedTo?: string;
} 