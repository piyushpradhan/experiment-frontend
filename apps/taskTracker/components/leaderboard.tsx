"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Award, Medal } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/types"

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard")
        }

        const data = await response.json()
        setLeaderboard(data.leaderboard)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Loading leaderboard...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (leaderboard.length === 0) {
    return <div className="text-center py-8 text-gray-500">No entries yet. Complete tasks to earn points!</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div key={entry.userId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center">
                {index === 0 && <Trophy className="w-5 h-5 mr-3 text-yellow-500" />}
                {index === 1 && <Medal className="w-5 h-5 mr-3 text-gray-400" />}
                {index === 2 && <Award className="w-5 h-5 mr-3 text-amber-700" />}
                {index > 2 && <span className="w-5 h-5 mr-3 text-center font-bold">{index + 1}</span>}
                <span className="font-medium">{entry.username}</span>
              </div>
              <div className="font-bold text-lg">{entry.points} pts</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
