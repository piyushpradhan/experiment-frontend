import { NextResponse } from "next/server"
import { completeTask, getTask } from "@/lib/redis"
import { getServerSession } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get user from session
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.id

    // Get task
    const task = await getTask(taskId)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Check if user is assigned to the task
    if (task.assigneeId !== session.userId) {
      return NextResponse.json({ error: "You are not assigned to this task" }, { status: 403 })
    }

    // Complete task
    await completeTask(taskId, session.userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Complete task error:", error)
    return NextResponse.json({ error: "Failed to complete task" }, { status: 500 })
  }
}
