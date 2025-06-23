import { TaskForm } from '@/components/task-form'
import { TaskList } from '@/components/task-list'
import { Leaderboard } from '@/components/leaderboard'

export default async function Dashboard() {
  // Redirect to login if not logged in
  // if (!session) {
  //   redirect("/")
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Task Tracker</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <TaskForm />
            <TaskList />
          </div>
          <div>
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  )
}
