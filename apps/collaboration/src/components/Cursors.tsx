import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'design-system'
import Cursor from './Cursor'

const collaborationUrl = import.meta.env.VITE_COLLABORATION_URL

type CursorType = {
  x: number
  y: number
  sender: string
  color: string
  username: string
}

type CursorMap = {
  [senderID: string]: CursorType
}

const connectToServer = async (): Promise<WebSocket> => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: NodeJS.Timeout | undefined
  let lastRan: number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    if (!lastRan) {
      // @ts-expect-error not specifying type here
      func.apply(this, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          // @ts-expect-error not specifying type here
          func.apply(this, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan))
    }
  }
}

type Props = {
  name: string
}

const Cursors = ({ name }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [cursors, setCursors] = useState<CursorMap>({})

  const updateCursors = useCallback((messageBody: CursorType) => {
    setCursors((prevCursors: CursorMap) => ({
      ...prevCursors,
      [messageBody.sender]: messageBody,
    }))
  }, [])

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (wsRef.current && containerRef.current) {
        const { left, top, width, height } =
          containerRef.current.getBoundingClientRect()
        // Send position relative to the container
        const message = {
          x: ((event.clientX - left) / width) * 100,
          y: ((event.clientY - top) / height) * 100,
          username: name,
        }
        wsRef.current.send(JSON.stringify(message))
      }
    },
    [name]
  )

  // Throttle the handleMouseMove function to limit the rate of sending messages
  const throttledMouseMove = useRef(throttle(handleMouseMove, 100)).current

  useEffect(() => {
    const initializeWebSocket = async () => {
      const ws = await connectToServer()
      wsRef.current = ws

      ws.onmessage = (webSocketMessage) => {
        console.log({ webSocketMessage })
        const messageBody: CursorType = JSON.parse(webSocketMessage.data)
        updateCursors(messageBody)
      }
    }

    initializeWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [updateCursors])

  useEffect(() => {
    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.addEventListener('mousemove', throttledMouseMove)
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('mousemove', throttledMouseMove)
      }
    }
  }, [throttledMouseMove])

  return (
    <Box
      ref={containerRef}
      direction="column"
      style={{
        cursor: 'none',
        border: 'none',
      }}
    >
      {Object.values(cursors).map((cursorData) => (
        <Cursor key={cursorData.sender} messageBody={cursorData} />
      ))}
    </Box>
  )
}

export default Cursors
