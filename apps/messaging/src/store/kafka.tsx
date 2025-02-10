import React, { RefObject, createContext, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { loadMoreMessages as loadMoreMessagesAction } from '@messaging/store/actions'
import useLoadMessages from '@messaging/lib/hooks/useLoadMessages'
import { fetchMoreMessages } from '@messaging/api/messages'
import { useSelector } from 'react-redux'
import { getActiveChannel } from '@messaging/store/selectors'
import type { AppState, MessageSocketResponse } from '@messaging/types'

interface KafkaContextProps {
  isLoading: boolean
  sendMessage: (
    inputRef: RefObject<HTMLInputElement>,
    channelId: string,
    sender: string | null,
    taggedMessage?: string | null
  ) => void
  deleteMessage: () => void
  createChannel: (channelName: string) => void
  deleteChannel: (channelId: string) => void
  loadMoreMessages: () => void
  handleChannelMessages: (data: {
    channelId: string
    messages: MessageSocketResponse[]
  }) => void
}

export const KafkaContext = createContext<KafkaContextProps | undefined>(
  undefined
)

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const KafkaProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const { limit, initialChannelLoad, loading, offset, loadMoreMessages } =
    useLoadMessages()

  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )

  const sendMessage = useCallback(
    async (
      inputRef: RefObject<HTMLInputElement>,
      channelId: string,
      sender: string | null,
      taggedMessage: string | null = null
    ) => {
      if (inputRef.current && sender) {
        const value = inputRef.current.value
        await fetch(`${backendUrl}/message/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-message-protocol': 'kafka',
          },
          body: JSON.stringify({
            channelId,
            sender,
            contents: value,
            taggedMessage,
          }),
        })
        inputRef.current.value = ''
      }
    },
    []
  )

  const handleChannelMessages = (data: {
    messages: MessageSocketResponse[]
    channelId: string
  }) => {
    if (data.channelId === null) return

    // dispatch(setChannelMessages(data.messages, data.channelId))

    // TODO: Check if the response is for the active channel
    if (data.messages.length > 0 && initialChannelLoad.current) {
      offset.current += limit
      initialChannelLoad.current = false
    }

    // TODO: Get tagged message details
    data.messages.map((message) => {
      if (message.tagged_message) {
        // socket.emit('requestSingleMessage', message.tagged_message)
      }
    })
  }

  const handleMoreChannelMessages = (data: {
    messages: MessageSocketResponse[]
    channelId: string
  }) => {
    if (data.channelId === null) return

    dispatch(loadMoreMessagesAction(data.messages, data.channelId))
  }

  const loadMoreKafkaMessages = useCallback(() => {
    loadMoreMessages(async () => {
      const response = await fetchMoreMessages(
        activeChannel,
        offset.current,
        limit
      )
      handleMoreChannelMessages({
        messages: response.messages,
        channelId: response.channelId,
      })
    })
  }, [
    offset.current,
    activeChannel,
    handleMoreChannelMessages,
    loadMoreMessages,
  ])

  const deleteMessage = useCallback(() => {}, [])

  const createChannel = useCallback(() => {}, [])

  const deleteChannel = useCallback(() => {}, [])

  return (
    <KafkaContext.Provider
      value={{
        isLoading: loading,
        sendMessage,
        deleteMessage,
        createChannel,
        deleteChannel,
        loadMoreMessages: loadMoreKafkaMessages,
        handleChannelMessages,
      }}
    >
      {children}
    </KafkaContext.Provider>
  )
}

export default KafkaProvider
