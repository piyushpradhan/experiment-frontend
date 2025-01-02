import * as atypes from '../../store/actionTypes'
import type { MessageSocketResponse, Action } from '@messaging/types'
import type {
  SetChannelMessagesPayload,
  SetSingleMessagePayload,
  TagMessagePayload,
} from '@messaging/store/actions/types'

export const setChannelMessages = (
  messages: MessageSocketResponse[],
  channelId: string
): Action<string, SetChannelMessagesPayload> => ({
  type: atypes.SET_CHANNEL_MESSAGES,
  payload: {
    messages,
    channelId,
  },
})

export const updateLatestMessage = (
  message: MessageSocketResponse,
  channelId: string
) => ({
  type: 'UPDATE_LATEST_MESSAGE',
  payload: {
    message,
    channelId,
  },
})

export const tagMessage = (
  messageId: string | null
): Action<string, TagMessagePayload> => ({
  type: atypes.TAG_MESSAGE,
  payload: {
    messageId,
  },
})

export const loadMoreMessages = (
  messages: MessageSocketResponse[],
  channelId: string
): Action<string, SetChannelMessagesPayload> => ({
  type: atypes.LOAD_MORE_MESSAGES,
  payload: {
    messages,
    channelId,
  },
})

export const setSingleMessageDetails = (
  message: MessageSocketResponse
): Action<string, SetSingleMessagePayload> => ({
  type: atypes.SET_SINGLE_MESSAGE,
  payload: {
    message,
  },
})
