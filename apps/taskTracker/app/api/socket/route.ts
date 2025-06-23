import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Validate session token
  const userId = await redis.get(`session:${token}`)

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // This is a simplified example - in a real app, you'd use a WebSocket library
  // For this demo, we'll use Server-Sent Events (SSE)
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()

  // Subscribe to task updates
  const subscriber = redis.duplicate()
  await subscriber.subscribe("task-updates", (message) => {
    writer.write(`data: ${message}\n\n`)
  })

  // Handle connection close
  request.signal.addEventListener("abort", async () => {
    await subscriber.unsubscribe("task-updates")
    await subscriber.quit()
    writer.close()
  })

  return new NextResponse(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
