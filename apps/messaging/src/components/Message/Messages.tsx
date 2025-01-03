import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'

import MessageComponent from '@messaging/components/Message/ChatBlock'

import {
  getMessagesById,
  getActiveChannelDetails,
  getSelectedSource,
} from '@messaging/store/selectors'

import type { AppState } from '@messaging/types'
import { useKafka, useSocket } from '@messaging/lib/hooks/sources'
import { messageTimestampComparator } from '@messaging/lib/utils'

const Messages = () => {
  const {
    loadMoreMessages: loadSocketMoreMessages,
    isLoading: isSocketLoading,
  } = useSocket()
  const { loadMoreMessages: loadKafkaMoreMessages, isLoading: isKafkaLoading } =
    useKafka()

  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const isScrolledToBottomRef = useRef(true)
  const previousScrollHeightRef = useRef(0)

  const activeUser = localStorage.getItem('user')

  const messagesById = useSelector((state: AppState) => getMessagesById(state))
  const activeChannel = useSelector((state: AppState) =>
    getActiveChannelDetails(state)
  )
  const selectedSource = useSelector((state: AppState) =>
    getSelectedSource(state)
  )

  const loadMoreMessages =
    selectedSource === 'kafka' ? loadKafkaMoreMessages : loadSocketMoreMessages
  const isLoading =
    selectedSource === 'kafka' ? isKafkaLoading : isSocketLoading

  const messages = useMemo(
    () => Object.values(messagesById).sort(messageTimestampComparator),
    [messagesById]
  )

  // Scroll to the bottom on initial load
  useEffect(() => {
    if (messageContainerRef.current && isScrolledToBottomRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }
  }, [activeChannel?.id])

  // Maintain scroll position after loading more messages
  useEffect(() => {
    if (messageContainerRef.current && previousScrollHeightRef.current > 0) {
      const newScrollHeight = messageContainerRef.current.scrollHeight
      const scrollDiff = newScrollHeight - previousScrollHeightRef.current
      messageContainerRef.current.scrollTop = scrollDiff
      previousScrollHeightRef.current = 0 // Reset for next load
    }
  }, [messages])

  const handleScroll = useCallback(() => {
    if (messageContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        messageContainerRef.current

      // Check if the user is at the bottom
      isScrolledToBottomRef.current =
        scrollTop + clientHeight >= scrollHeight - 1

      // Load more messages if at the top
      if (scrollTop === 0 && !isLoading) {
        previousScrollHeightRef.current = scrollHeight
        loadMoreMessages()
      }
    }
  }, [loadMoreMessages, activeChannel?.id, isLoading])

  useEffect(() => {
    const container = messageContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className="h-full overflow-hidden">
      <div
        ref={messageContainerRef}
        className="overflow-y-auto flex flex-col h-full"
      >
        <div className="flex flex-col justify-end flex-grow gap-2 pt-2 px-2">
          {messages.map((message) => (
            <MessageComponent
              key={`${message.id}-${Math.random()}`}
              message={message}
              uid={`${activeUser}`}
            />
          ))}
          <div ref={endOfMessagesRef}></div>
        </div>
      </div>
    </div>
  )
}

export default Messages
