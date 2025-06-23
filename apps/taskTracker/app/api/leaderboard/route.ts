import { NextResponse } from "next/server"
import { getLeaderboard } from "@/lib/redis"

export async function GET() {
  try {
    const leaderboard = await getLeaderboard(10)

    return NextResponse.json({ leaderboard })
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Failed to get leaderboard" }, { status: 500 })
  }
}
