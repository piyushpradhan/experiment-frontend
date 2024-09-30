import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import MessageComponent from '@messaging/components/Message/ChatBlock'

import { getMessagesById, getActiveChannel } from '@messaging/store/selectors'

import type { AppState } from '@messaging/types'
import { useSocket } from '@messaging/store/hooks'
import { messageTimestampComparator } from '@messaging/lib/utils'

const Messages = () => {
  const { loadMoreMessages, isLoading } = useSocket()

  const endOfMessagesRef = useRef<HTMLDivElement>(null)
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const isScrolledToBottomRef = useRef(true)

  const activeUser = localStorage.getItem('user')

  const messagesById = useSelector((state: AppState) => getMessagesById(state))
  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )

  const messages = Object.values(messagesById).sort(messageTimestampComparator)

  // Scroll to the bottom on initial load
  useEffect(() => {
    if (messageContainerRef.current && isScrolledToBottomRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [activeChannel]);

  const handleScroll = () => {
    if (messageContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        messageContainerRef.current

      // Check if the user is at the bottom
      isScrolledToBottomRef.current =
        scrollTop + clientHeight >= scrollHeight - 1

      // Load more messages if at the top
      if (scrollTop === 0) {
        loadMoreMessages(activeChannel)
      }
    }
  }

  useEffect(() => {
    const container = messageContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [isLoading, activeChannel])

  return (
    <div
      ref={messageContainerRef}
      className="h-full overflow-y-scroll flex flex-col"
    >
      <div className="flex flex-col flex-1 justify-end flex-grow gap-2 pt-2 px-2">
        {messages.map((message) => (
          <MessageComponent
            key={`${message.id}-${Math.random()}`} // Unique key for each message
            message={message}
            uid={`${activeUser}`}
          />
        ))}
        <div ref={endOfMessagesRef}></div>
      </div>
    </div>
  )
}

export default Messages
