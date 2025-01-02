import React, { RefObject, createContext, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  loadMoreMessages as loadMoreMessagesAction,
  setChannels,
} from '@messaging/store/actions'
import { setSingleMessageDetails } from '@messaging/store/actions/message'
import useLoadMessages from '@messaging/lib/hooks/useLoadMessages'
import { fetchMoreMessages } from '@messaging/api/messages'
import { useSelector } from 'react-redux'
import { getActiveChannel, getSelectedSource } from '@messaging/store/selectors'
import type { AppState, MessageSocketResponse, Channel } from '@messaging/types'

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
  loadMoreMessages: (channelId: string) => void
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

  const selectedSource = useSelector((state: AppState) => {
    getSelectedSource(state)
  })
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
    console.log(
      'Increasing offset: ',
      offset.current,
      initialChannelLoad.current
    )

    if (
      data.channelId === activeChannel &&
      data.messages.length > 0 &&
      initialChannelLoad.current
    ) {
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

  useEffect(() => {
    const handleChannels = (data: Channel[]) => {
      dispatch(setChannels(data))
    }

    const handleMessageDetails = (message: MessageSocketResponse) => {
      if (message) {
        dispatch(setSingleMessageDetails(message))
      }
    }
  }, [activeChannel, selectedSource])

  const handleMoreChannelMessages = (data: {
    messages: MessageSocketResponse[]
    channelId: string
  }) => {
    if (data.channelId === null) return

    dispatch(loadMoreMessagesAction(data.messages, data.channelId))
  }

  const loadMoreKafkaMessages = () => {
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
  }

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
