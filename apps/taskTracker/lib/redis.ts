import { Redis } from "@upstash/redis"

// Define types
interface TaskData {
  ownerId: string
  description: string
  // Add other task properties as needed
}

interface UserData {
  username: string
  // Add other user properties as needed
}

// Initialize Redis client
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

// Task-related Redis functions
export async function createTask(taskData: TaskData): Promise<string> {
  const taskId = `task:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  // Store task data
  await redis.hset(taskId, {
    ...taskData,
    createdAt: Date.now(),
    status: "pending",
  })

  // Add to user's tasks
  await redis.zadd(`user:${taskData.ownerId}:tasks`, Date.now(), taskId)

  // Set expiration (24 hours)
  await redis.expire(taskId, 86400)

  return taskId
}

export async function getTask(taskId: string) {
  return redis.hgetall(taskId)
}

export async function getUserTasks(userId: string) {
  const taskIds = await redis.zrange(`user:${userId}:tasks`, 0, -1)

  if (!taskIds.length) return []

  const tasks = await Promise.all(
    taskIds.map(async (id) => {
      const task = await redis.hgetall(id)
      return { id, ...task }
    }),
  )

  return tasks
}

export async function completeTask(taskId: string, userId: string) {
  // Update task status
  await redis.hset(taskId, { status: "completed", completedAt: Date.now() })

  // Add points to user
  await redis.zincrby("leaderboard", 10, userId)

  // Publish update
  await redis.publish(
    "task-updates",
    JSON.stringify({
      type: "TASK_COMPLETED",
      taskId,
      userId,
    }),
  )

  return true
}

// User-related Redis functions
export async function createUser(userData: UserData) {
  const userId = `user:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

  await redis.hset(userId, {
    ...userData,
    createdAt: Date.now(),
    points: 0,
  })

  return userId
}

export async function getUser(userId: string) {
  return redis.hgetall(userId)
}

export async function createSession(userId: string) {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  // Store session with 24-hour expiry
  await redis.set(`session:${token}`, userId, { ex: 86400 })

  return token
}

export async function getSession(token: string) {
  return redis.get(`session:${token}`)
}

// Leaderboard functions
export async function getLeaderboard(limit = 10) {
  const leaderboard = await redis.zrevrange("leaderboard", 0, limit - 1, { withScores: true })

  const formattedLeaderboard = []

  for (let i = 0; i < leaderboard.length; i += 2) {
    const userId = leaderboard[i]
    const score = leaderboard[i + 1]

    const user = await getUser(userId)

    formattedLeaderboard.push({
      userId,
      username: user.username,
      points: score,
    })
  }

  return formattedLeaderboard
}

// Rate limiting
export async function checkRateLimit(userId: string, action: string, limit: number, windowSeconds: number) {
  const key = `ratelimit:${userId}:${action}`

  // Increment counter
  const count = await redis.incr(key)

  // Set expiry if this is the first request in the window
  if (count === 1) {
    await redis.expire(key, windowSeconds)
  }

  // Check if rate limit exceeded
  return count <= limit
}
