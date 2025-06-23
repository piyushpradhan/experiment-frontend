import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const token = cookies().get("session_token")?.value

    if (token) {
      // Delete session
      await redis.del(`session:${token}`)

      // Clear cookie
      cookies().delete("session_token")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}
