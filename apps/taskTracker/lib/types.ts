export interface TaskData {
  name: string
  description?: string
  ownerId: string
  assigneeId?: string
  status?: "pending" | "completed" | "expired"
  createdAt?: number
  completedAt?: number
}

export interface Task extends TaskData {
  id: string
}

export interface UserData {
  username: string
  email: string
  password: string
  createdAt?: number
  points?: number
}

export interface User extends UserData {
  id: string
}

export interface LeaderboardEntry {
  userId: string
  username: string
  points: number
}

export interface SessionData {
  userId: string
  token: string
  expiresAt: number
}
