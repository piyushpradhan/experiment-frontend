import { NextResponse } from "next/server"
import { createTask, getUserTasks, checkRateLimit } from "@/lib/redis"
import { getServerSession } from "@/lib/auth"
import { redis } from "@/lib/redis"

export async function POST(request: Request) {
  try {
    // Get user from session
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting (5 tasks per minute)
    const withinLimit = await checkRateLimit(session.userId, "create_task", 5, 60)

    if (!withinLimit) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 })
    }

    const { name, description, assigneeId } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Task name is required" }, { status: 400 })
    }

    // Create task
    const taskId = await createTask({
      name,
      description,
      ownerId: session.userId,
      assigneeId: assigneeId || session.userId,
    })

    // Publish task creation event
    await redis.publish(
      "task-updates",
      JSON.stringify({
        type: "TASK_CREATED",
        taskId,
        ownerId: session.userId,
      }),
    )

    return NextResponse.json({ taskId, success: true })
  } catch (error) {
    console.error("Task creation error:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Get user from session
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's tasks
    const tasks = await getUserTasks(session.userId)

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Failed to get tasks" }, { status: 500 })
  }
}
