import {
  useEffect,
  useCallback,
  RefObject,
  createContext,
  useState,
  useRef,
} from 'react'
import { useDispatch } from 'react-redux'

import {
  loadMoreMessages as loadMoreMessagesAction,
  setChannels,
} from '../store/actions'

import type { AppState, Channel, MessageSocketResponse } from '@messaging/types'
import { setChannelMessages, setSingleMessageDetails } from './actions/message'
import { getSocket } from './utils'
import { Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { getActiveChannel } from './selectors'

interface SocketContextProps {
  isLoading: boolean
  socket: Socket
  joinChannel: (channelId: string) => void
  sendMessage: (
    inputRef: RefObject<HTMLInputElement>,
    channelId: string,
    sender: string | null,
    taggedMessage?: string | null
  ) => void
  deleteMessage: () => void
  createChannel: (channelName: string) => void
  deleteChannel: (channelId: string) => void
  loadMoreMessages: (channelId: string) => void
}

export const SocketContext = createContext<SocketContextProps | undefined>(
  undefined
)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = getSocket()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const offset = useRef<number>(0)
  const initialChannelLoad = useRef<boolean>(true)
  const limit = 30 // batch size

  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )

  useEffect(() => {
    setHasMoreMessages(true)
    offset.current = 0
    initialChannelLoad.current = true
  }, [activeChannel])

  useEffect(() => {
    const handleChannelMessages = (data: {
      messages: MessageSocketResponse[]
      channelId: string
    }) => {
      if (data.channelId === null) return

      dispatch(setChannelMessages(data.messages, data.channelId))

      if (
        data.channelId === activeChannel &&
        data.messages.length > 0 &&
        initialChannelLoad.current
      ) {
        offset.current += limit
        initialChannelLoad.current = false
      }

      console.log({ data })

      data.messages.map((message) => {
        if (message.tagged_message) {
          socket.emit('requestSingleMessage', message.tagged_message)
        }
      })
    }

    const handleChannels = (data: Channel[]) => {
      dispatch(setChannels(data))
    }

    const handleMoreChannelMessages = (data: {
      messages: MessageSocketResponse[]
      channelId: string
    }) => {
      if (data.channelId === null) return

      dispatch(loadMoreMessagesAction(data.messages, data.channelId))
    }

    const handleMessageDetails = (message: MessageSocketResponse) => {
      if (message) {
        dispatch(setSingleMessageDetails(message))
      }
    }

    socket.on('connect', () => {
      socket.emit('join')
    })

    socket.on('channelMessages', handleChannelMessages)
    socket.on('channels', handleChannels)
    socket.on('moreChannelMessages', handleMoreChannelMessages)
    socket.on('singleMessage', handleMessageDetails)

    return () => {
      socket.off('channels')
      socket.off('message')
      socket.off('channelMessages')
      socket.off('moreChannelMessages')
      socket.off('singleMessage')
    }
  }, [activeChannel])

  const loadMoreMessages = useCallback(() => {
    try {
      if (loading || !hasMoreMessages) return

      setLoading(true)
      socket.emit('loadMoreMessages', {
        channelId: activeChannel,
        offset: offset.current,
        limit,
      })

      setLoading(false)
    } catch (err) {
      console.error(err)
    }
  }, [activeChannel])

  const joinChannel = useCallback((channelId: string) => {
    try {
      socket.emit('joinChannel', channelId)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteMessage = useCallback(() => {
    try {
      socket.emit('deleteMessage', {
        channelId: '1234',
        sender: '876542',
      })
    } catch (err) {
      console.error(err)
    }
  }, [])

  const sendMessage = useCallback(
    (
      inputRef: RefObject<HTMLInputElement>,
      channelId: string,
      sender: string | null,
      taggedMessage: string | null = null
    ) => {
      if (inputRef.current && sender) {
        try {
          const value = inputRef.current.value
          socket.emit('message', {
            channelId,
            sender,
            contents: value,
            taggedMessage,
          })
        } catch (err) {
          console.error(err)
        } finally {
          inputRef.current.value = ''
        }
      }
    },
    []
  )

  const createChannel = useCallback((channelName: string) => {
    try {
      if (channelName.length > 0) {
        socket.emit('createChannel', {
          name: channelName,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteChannel = useCallback((channelId: string) => {
    try {
      if (channelId) {
        socket.emit('deleteChannel', {
          channelId,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <SocketContext.Provider
      value={{
        isLoading: loading,
        socket,
        joinChannel,
        sendMessage,
        deleteMessage,
        createChannel,
        deleteChannel,
        loadMoreMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
