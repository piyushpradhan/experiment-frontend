import { useEffect, useCallback, RefObject, createContext } from 'react'
import { useDispatch } from 'react-redux'

import {
  loadMoreMessages as loadMoreMessagesAction,
  setChannels,
} from '@messaging/store/actions'

import type { AppState, Channel, MessageSocketResponse } from '@messaging/types'
import { setChannelMessages, setSingleMessageDetails } from './actions/message'
import { getSocket } from '@messaging/store/utils'
import { Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { getActiveChannel, getSelectedSource } from '@messaging/store/selectors'
import useLoadMessages from '@messaging/lib/hooks/useLoadMessages'

interface SocketContextProps {
  isLoading: boolean
  socket: Socket | null
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
  const selectedSource = useSelector((state: AppState) =>
    getSelectedSource(state)
  )
  const socket = getSocket(selectedSource)
  const dispatch = useDispatch()
  const { limit, initialChannelLoad, loading, offset, loadMoreMessages } =
    useLoadMessages()

  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )

  // Disconnect socket when the source is changed
  useEffect(() => {
    if (selectedSource !== 'socket') {
      socket?.disconnect()
    }
  }, [selectedSource])

  useEffect(() => {
    if (selectedSource === 'socket' && socket) {
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
    }
  }, [activeChannel])

  const loadMoreSocketMessages = useCallback(() => {
    if (selectedSource === 'socket' && socket) {
      loadMoreMessages(() => {
        socket.emit('loadMoreMessages', {
          channelId: activeChannel,
          offset: offset.current,
          limit,
        })
      }, socket)
    }
  }, [activeChannel])

  const joinChannel = useCallback((channelId: string) => {
    try {
      if (socket) {
        socket.emit('joinChannel', channelId)
      }
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteMessage = useCallback(() => {
    try {
      if (socket) {
        socket.emit('deleteMessage', {
          channelId: '1234',
          sender: '876542',
        })
      }
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
      if (inputRef.current && sender && socket) {
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
      if (channelName.length > 0 && socket) {
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
      if (channelId && socket) {
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
        loadMoreMessages: loadMoreSocketMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
