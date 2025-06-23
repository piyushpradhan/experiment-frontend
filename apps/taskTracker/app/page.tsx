import { AuthForm } from '@/components/auth-form'
import { getServerSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Dashboard from './dashboard/page'

export default async function Home() {
  const session = await getServerSession()

  return <Dashboard />
}
