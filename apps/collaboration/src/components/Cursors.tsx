import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'design-system'
import Cursor from './Cursor'
import { throttle } from '@collaboration/utils'
import { connectToServer } from '@collaboration/utils/socket'

type CursorType = {
  x: number
  y: number
  sender: string
  color: string
  username: string
}

type Props = {
  name: string
  id: string
}

const Cursors = ({ name, id }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [cursors, setCursors] = useState<CursorType[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [reconnectDelay, setReconnectDelay] = useState<number>(1000)

  console.log({ cursors })

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
        const message = {
          x: ((event.clientX - left) / width) * 100,
          y: ((event.clientY - top) / height) * 100,
          sender: id,
          username: name,
        }
        wsRef.current.send(JSON.stringify(message))
      }
    },
    [name]
  )

  const throttledMouseMove = useRef(throttle(handleMouseMove, 100)).current

  const initializeWebSocket = async () => {
    const ws = await connectToServer()
    wsRef.current = ws
    setIsConnected(true)
    setReconnectDelay(1000) // Reset reconnect delay on successful connection

    ws.onmessage = (webSocketMessage) => {
      const messageBody: CursorType = JSON.parse(webSocketMessage.data)
      updateCursors(messageBody)
    }

    ws.onclose = () => {
      setIsConnected(false)
      setCursors((prevCursors) =>
        prevCursors.filter((cursor) => cursor.sender !== name)
      )
      attemptReconnect()
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const attemptReconnect = () => {
    setTimeout(() => {
      setReconnectDelay((prev) => Math.min(prev * 2, 30000)) // Exponential backoff
      initializeWebSocket()
    }, reconnectDelay)
  }

  useEffect(() => {
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
      {!isConnected && <div>Reconnecting...</div>}
    </Box>
  )
}

export default Cursors
