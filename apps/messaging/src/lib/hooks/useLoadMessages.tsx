import { getActiveChannel, getSelectedSource } from '@messaging/store/selectors'
import { AppState } from '@messaging/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'

const useLoadMessages = () => {
  const selectedSource = useSelector((state: AppState) =>
    getSelectedSource(state)
  )
  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )
  const [loading, setLoading] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const offset = useRef<number>(0)
  const initialChannelLoad = useRef<boolean>(true)
  const limit = 30 // Batch size

  useEffect(() => {
    setHasMoreMessages(true)
    offset.current = 0
    initialChannelLoad.current = true
  }, [activeChannel, selectedSource])

  useEffect(() => {}, [activeChannel, selectedSource])

  const loadMoreMessages = useCallback(
    (callback: () => void, socket?: Socket) => {
      try {
        if (
          loading ||
          !hasMoreMessages ||
          (selectedSource === 'socket' && !socket)
        )
          return

        setLoading(true)
        callback()

        setLoading(false)
      } catch (err) {
        console.error(err)
      }
    },
    [activeChannel]
  )

  return {
    limit,
    initialChannelLoad,
    loading,
    offset,
    loadMoreMessages,
  }
}

export default useLoadMessages
