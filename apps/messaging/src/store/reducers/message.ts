import * as atypes from '../../store/actionTypes'

import type {
  MessagesById,
  Action,
  MessageSocketResponse,
  TaggedMessage,
} from '@messaging/types'
import { combineReducers } from '@reduxjs/toolkit'
import { SetChannelMessagesPayload, TagMessagePayload } from '../actions/types'

const taggedMessage = (
  state: TaggedMessage = null,
  action: Action<string, unknown>
) => {
  switch (action.type) {
    case atypes.TAG_MESSAGE: {
      const { payload }: Action<string, TagMessagePayload> = action as Action<
        string,
        TagMessagePayload
      >
      return payload.messageId || null
    }
    default:
      return state
  }
}

const byId = (state: MessagesById = {}, action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.SET_CHANNEL_MESSAGES: {
      const { payload }: Action<string, SetChannelMessagesPayload> =
        action as Action<string, SetChannelMessagesPayload>

      if (!payload.messages) return state

      const messages: MessageSocketResponse[] = (payload.messages ||
        []) as MessageSocketResponse[]
      const messagesById: MessagesById = payload.isSwitchingChannels
        ? {}
        : { ...state }

      console.log({ isSwitching: payload.isSwitchingChannels })

      messages.map((message) => {
        messagesById[message.id] = {
          id: message.id,
          sender: message.sender,
          contents: message.contents,
          timestamp: message.timestamp,
          channelId: message.channel_id,
          taggedMessage: message.tagged_message,
        }
      })

      console.log({ messages })

      return messagesById
    }
    default:
      return state
  }
}

const allMessages = (state: string[] = [], action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.SET_CHANNEL_MESSAGES: {
      const { payload }: Action<string, SetChannelMessagesPayload> =
        action as Action<string, SetChannelMessagesPayload>

      const messages: MessageSocketResponse[] = (payload.messages ||
        []) as MessageSocketResponse[]
      return messages.map((message) => message.id)
    }
    default:
      return state
  }
}

const messageReducer = combineReducers({
  taggedMessage,
  byId,
  all: allMessages,
})

export default messageReducer
