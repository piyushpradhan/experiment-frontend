import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

// This endpoint would be called by a cron job (e.g., Vercel Cron)
export async function GET() {
  try {
    // Get all tasks
    const keys = await redis.keys("task:*")
    const now = Date.now()
    let expiredCount = 0

    for (const key of keys) {
      const task = await redis.hgetall(key)

      // Skip completed or already expired tasks
      if (task.status === "completed" || task.status === "expired") {
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

        expiredCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${keys.length} tasks, expired ${expiredCount} tasks`,
    })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
