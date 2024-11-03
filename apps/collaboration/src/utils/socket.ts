const collaborationUrl = import.meta.env.VITE_COLLABORATION_URL

export async function connectToServer(): Promise<WebSocket> {
  const ws: WebSocket = new WebSocket(`${collaborationUrl}/ws`)
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer)
        resolve(ws)
      }
    }, 10)
  })
}
