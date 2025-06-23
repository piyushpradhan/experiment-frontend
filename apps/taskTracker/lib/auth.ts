import { cookies } from 'next/headers'
import { getSession, getUser } from './redis'

export async function getServerSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) {
    return null
  }

  try {
    const userId = await getSession(token) as string

    if (!userId) {
      return null
    }

    const user = await getUser(userId)

    if (!user) {
      return null
    }

    return {
      userId,
      user,
    }
  } catch (error) {
    console.error('Session error:', error)
    return null
  }
}
