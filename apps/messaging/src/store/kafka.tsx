import { MessageSocketResponse } from '@messaging/types'
import React, {
  RefObject,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { setChannelMessages } from './actions'

interface KafkaContextProps {
  isLoading: boolean
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
}

export const KafkaContext = createContext<KafkaContextProps | undefined>(
  undefined
)

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const KafkaProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const joinChannel = useCallback(
    (channelId: string) => {
      if (eventSource) {
        eventSource.close()
      }

      const newEventSource = new EventSource(
        `${backendUrl}/message/${channelId}`
      )
      setEventSource(newEventSource)

      newEventSource.onmessage = (event) => {
        const data: { messages: MessageSocketResponse[]; channelId: string } =
          JSON.parse(event.data)
        dispatch(setChannelMessages(data.messages, data.channelId))
      }
      newEventSource.onerror = (error) => {
        console.error('Eventsource failed: ', error)
        newEventSource.close()
      }
    },
    [dispatch, eventSource]
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

  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const deleteMessage = useCallback(() => {}, [])

  const createChannel = useCallback(() => {}, [])

  const deleteChannel = useCallback(() => {}, [])

  return (
    <KafkaContext.Provider
      value={{
        isLoading: loading,
        joinChannel,
        sendMessage,
        deleteMessage,
        createChannel,
        deleteChannel,
      }}
    >
      {children}
    </KafkaContext.Provider>
  )
}

export default KafkaProvider
