import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'design-system'
import Cursor from './Cursor'
import JoinModal from '../JoinModal'

import { throttle } from '../../utils'

type CursorType = {
  x: number
  y: number
  sender: string
  color: string
  name: string
}

const connectToServer = async (): Promise<WebSocket> => {
  const ws: WebSocket = new WebSocket('ws://localhost:7071/ws')
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer)
        resolve(ws)
      }
    }, 10)
  })
}

const Cursors = () => {
  const storedUser: User = JSON.parse(localStorage.getItem('user') || '{}')
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

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (wsRef.current && containerRef.current && storedUser.uid) {
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect()
      // Send position relative to the container
      const message = {
        x: ((event.clientX - left) / width) * 100,
        y: ((event.clientY - top) / height) * 100,
        username: storedUser.name,
      }
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  // Throttle the handleMouseMove function to limit the rate of sending messages
  const throttledMouseMove = useRef(throttle(handleMouseMove, 100)).current

  useEffect(() => {
    const initializeWebSocket = async () => {
      const ws = await connectToServer()
      wsRef.current = ws

      ws.onmessage = (webSocketMessage) => {
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

  if (!storedUser.uid) {
    return <JoinModal />
  }

  return (
    <Box ref={containerRef} direction="column" border="none">
      {cursors.map((cursorData) => (
        <Cursor key={cursorData.sender} messageBody={cursorData} />
      ))}
    </Box>
  )
}

export default Cursors
