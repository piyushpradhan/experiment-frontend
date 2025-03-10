import { backendUrl } from '@messaging/lib/utils'

export const checkHealth = async () => {
  try {
    const response = await fetch(`${backendUrl}/health`)
    const data = await response.json()

    return data.status !== 'unavailable'
  } catch (error) {
    console.error(error)
    return false
  }
}
