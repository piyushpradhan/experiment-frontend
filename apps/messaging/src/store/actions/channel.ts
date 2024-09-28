import * as atypes from '../../store/actionTypes'
import type { Channel } from '@messaging/types'

export const setActiveChannel = (channelId: string) => ({
  type: atypes.SET_ACTIVE_CHANNEL,
  payload: channelId,
})

export const setChannels = (channels: Channel[]) => ({
  type: atypes.SET_CHANNELS,
  payload: channels,
})
