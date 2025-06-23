import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET() {
  try {
    // Get all tasks
    const keys = await redis.keys("task:*")
    const now = Date.now()

    for (const key of keys) {
      const task = await redis.hgetall(key)

      // Skip completed tasks
      if (task.status === "completed") {
        continue
      }

      // Check if task is expired (created more than 24 hours ago)
      if (task.createdAt && now - Number.parseInt(task.createdAt) > 24 * 60 * 60 * 1000) {
        // Mark as expired
        await redis.hset(key, { status: "expired" })

        // Publish update
        await redis.publish(
          "task-updates",
          JSON.stringify({
            type: "TASK_EXPIRED",
            taskId: key,
          }),
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Worker error:", error)
    return NextResponse.json({ error: "Worker failed" }, { status: 500 })
  }
}
