import * as atypes from '../../store/actionTypes'
import type {
  ChannelState,
  ChannelsById,
  Action,
  ChannelSocketResponse,
  MessageSocketResponse,
} from '@messaging/types'
import { combineReducers } from '@reduxjs/toolkit'
import { SetChannelMessagesPayload } from '../../store/actions/types'

const activeChannel = (
  state: Pick<ChannelState, 'activeChannel'> | null = null,
  action: Action<string, unknown>
) => {
  switch (action.type) {
    case atypes.SET_CHANNELS: {
      const channels: ChannelSocketResponse[] = (action.payload ||
        []) as ChannelSocketResponse[]

      if (!channels || channels.length === 0) return state

      return channels[0].id
    }
    case atypes.SET_CHANNEL_MESSAGES: {
      const { payload } = action as Action<string, SetChannelMessagesPayload>

      if (!payload.channelId) return state

      return payload.channelId
    }
    case atypes.SET_ACTIVE_CHANNEL:
      return action.payload
    default:
      return state
  }
}

const byId = (state: ChannelsById = {}, action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.SET_CHANNELS: {
      const channels: ChannelSocketResponse[] = (action.payload ||
        []) as ChannelSocketResponse[]
      const channelsById: ChannelsById = {}
      channels.map((channel) => {
        channelsById[channel.id] = {
          id: channel.id,
          name: channel.name,
          createdAt: channel.created_at,
          updatedAt: channel.updated_at,
          lastMessage: channel.last_message,
        }
      })
      return channelsById
    }
    case atypes.SET_CHANNEL_MESSAGES: {
      const { payload } = action as Action<string, SetChannelMessagesPayload>

      if (!payload.messages || !payload.channelId) return state

      const lastChannelMessage: MessageSocketResponse = payload.messages[
        payload.messages.length - 1
      ] as MessageSocketResponse
      const lastMessage =
        payload.messages.length > 0 ? lastChannelMessage.contents : null
      const lastUpdated =
        payload.messages.length > 0 ? lastChannelMessage.timestamp : null

      return {
        ...state,
        [payload.channelId]: {
          ...state[payload.channelId],
          lastMessage,
          updatedAt: lastUpdated,
        },
      }
    }
    default:
      return state
  }
}

const allChannels = (state: string[] = [], action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.SET_CHANNELS: {
      const channels: ChannelSocketResponse[] = (action.payload ||
        []) as ChannelSocketResponse[]
      return channels.map((channel) => channel.id)
    }
    default:
      return state
  }
}

const channelReducer = combineReducers({
  activeChannel,
  byId,
  all: allChannels,
})

export default channelReducer
