"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import type { Task } from "@/lib/types"
import { useRouter } from "next/navigation"

export function TaskList() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks")

        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }

        const data = await response.json()
        setTasks(data.tasks)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Set up real-time updates
  useEffect(() => {
    // Get session token from cookie
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
    }

    const token = getCookie("session_token")

    if (!token) return

    // Connect to SSE endpoint
    const eventSource = new EventSource(`/api/socket?token=${token}`)

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "TASK_CREATED") {
          // Refresh tasks
          router.refresh()
        } else if (data.type === "TASK_COMPLETED") {
          // Update task in list
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === data.taskId ? { ...task, status: "completed" } : task)),
          )
        } else if (data.type === "TASK_EXPIRED") {
          // Update task in list
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === data.taskId ? { ...task, status: "expired" } : task)),
          )
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error)
      }
    }

    eventSource.onerror = () => {
      console.error("SSE connection error")
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [router])

  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to complete task")
      }

      // Update task in list
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))

      // Refresh to update leaderboard
      router.refresh()
    } catch (error) {
      console.error("Error completing task:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks yet. Create your first task!</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className={task.status === "completed" ? "bg-gray-50" : ""}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className={task.status === "completed" ? "line-through text-gray-500" : ""}>
                {task.name}
              </CardTitle>
              <StatusBadge status={task.status} />
            </div>
            <CardDescription>{new Date(Number.parseInt(task.createdAt)).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={task.status === "completed" ? "text-gray-500" : ""}>
              {task.description || "No description provided"}
            </p>
          </CardContent>
          <CardFooter>
            {task.status === "pending" && (
              <Button onClick={() => completeTask(task.id)} className="w-full">
                Complete Task
              </Button>
            )}
            {task.status === "completed" && (
              <div className="text-sm text-gray-500 w-full text-center">
                Completed on {new Date(Number.parseInt(task.completedAt)).toLocaleString()}
              </div>
            )}
            {task.status === "expired" && (
              <div className="text-sm text-red-500 w-full text-center">This task has expired</div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    case "expired":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
  }
}
