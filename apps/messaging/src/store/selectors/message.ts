import { Message, MessagesState } from '@messaging/types'
import { createSelector } from 'reselect'

export const getAllMessages = (state: MessagesState) => state.all
export const getMessagesById = (state: MessagesState) => state.byId

export const getMessage = (state: MessagesState, messageId: string | null) =>
  messageId ? state.byId[messageId] : null

export const getTaggedMessageId = (state: MessagesState) => state.taggedMessage
export const getTaggedMessage = createSelector(
  [getTaggedMessageId, getMessagesById],
  (taggedMessageId, messagesById) => {
    if (taggedMessageId) {
      return messagesById[taggedMessageId]
    }
    return null
  }
)

export const getMessagesGroupedBySender = createSelector(
  [getMessagesById, getAllMessages],
  (messagesById, allMessageIds) => {
    const groupedMessages: { [messageId: string]: Message[] } = {}

    // Loop through all message ids
    allMessageIds.forEach((messageId) => {
      const message = messagesById[messageId]
      if (message) {
        // Group messages by sender
        if (!groupedMessages[message.sender]) {
          groupedMessages[message.sender] = []
        }
        groupedMessages[message.sender].push(message)
      }
    })

    return groupedMessages
  }
)
