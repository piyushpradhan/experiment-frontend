import { useCallback, useEffect, useRef, useState } from 'react'
import { Box } from 'design-system'
import Cursor from './Cursor'
import { throttle } from '../utils'
import { connectToServer } from '../utils/socket'
import type { CursorMap, CursorType } from '../types'

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
      [messageBody.username]: messageBody,
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
      let ws = await connectToServer()
      wsRef.current = ws

      ws.onmessage = (webSocketMessage) => {
        const messageBody: CursorType = JSON.parse(webSocketMessage.data)
        updateCursors(messageBody)
      }

      ws.onclose = async () => {
        try {
          ws = await connectToServer()
          wsRef.current = ws
          console.log('Reconnected to the server')
        } catch (error) {
          console.error('Reconnection failed: ', error)
        }
      }
    }

    initializeWebSocket().then(() => {})

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        wsRef.current?.readyState !== WebSocket.OPEN
      ) {
        initializeWebSocket().then(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
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
