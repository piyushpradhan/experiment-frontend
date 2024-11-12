const collaborationUrl = import.meta.env.VITE_COLLABORATION_URL

export async function connectToServer(): Promise<WebSocket> {
  try {
    const ws: WebSocket = new WebSocket(`${collaborationUrl}/ws`)
    return new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        if (ws.readyState === 1) {
          clearInterval(timer)
          resolve(ws)
        } else if (ws.readyState === 3) {
          clearInterval(timer)
          reject(new Error('WebSocket connection failed'))
        }
      }, 10)
    })
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error)
    throw error
  }
}
