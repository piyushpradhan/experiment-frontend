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

const connectToServer = async (): Promise<WebSocket> => {
  const ws: WebSocket = new WebSocket(`${collaborationUrl}:7071/ws`)
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer)
        resolve(ws)
      }
    }, 10)
  })
}

function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: NodeJS.Timeout | undefined
  let lastRan: number

  return function (...args: any[]) {
    // @ts-expect-error not specifying type here
    const context = this
    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args)
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
  const [cursors, setCursors] = useState<CursorType[]>([])

  const updateCursors = useCallback((messageBody: CursorType) => {
    setCursors((prevCursors: CursorType[]) => {
      const existingCursorIndex = prevCursors.findIndex(
        (cursor) => cursor.sender === messageBody.sender
      )
      if (existingCursorIndex !== -1) {
        const updatedCursors = [...prevCursors]
        updatedCursors[existingCursorIndex] = messageBody
        return updatedCursors
      }
      return [...prevCursors, messageBody]
    })
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
        wsRef.current.close() // Clean up the WebSocket connection
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
    <Box ref={containerRef} direction="column" border="none">
      {cursors.map((cursorData) => (
        <Cursor key={cursorData.sender} messageBody={cursorData} />
      ))}
    </Box>
  )
}

export default Cursors
