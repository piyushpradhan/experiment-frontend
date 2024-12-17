import { createSelector } from 'reselect'

import type { ChannelState, ChannelsById } from '@messaging/types'
import { updatedAtComparator } from '@messaging/lib/utils'

export const getAllChannelDetails = (state: ChannelState) => state.byId
export const getAllChannels = (state: ChannelState) => state.all

export const getActiveChannel = (state: ChannelState) => state.activeChannel

export const getChannelDetails = createSelector(
  [
    getAllChannelDetails,
    (_state: ChannelState, channelId: string) => channelId,
  ],
  (channelDetails, channelId) => {
    return channelDetails[channelId]
  }
)

export const getActiveChannelDetails = createSelector(
  [getActiveChannel, getAllChannelDetails],
  (activeChannel, channelDetails) => {
    return channelDetails[activeChannel]
  }
)

export const getSortedChannels = createSelector(
  [getAllChannels, getAllChannelDetails],
  (allChannels: string[], channelsById: ChannelsById) => {
    return allChannels
      .map((channelId) => channelsById[channelId])
      .slice() // Create a shallow copy to avoid mutating original data
      .sort(updatedAtComparator)
  }
)

export const getLatestChannel = createSelector(
  [getAllChannelDetails],
  (channelDetails: ChannelsById) => {
    const channels = Object.values(channelDetails)
    return channels.sort(function (channelA, channelB) {
      if (channelA.updatedAt < channelB.updatedAt) return 1
      if (channelA.updatedAt > channelB.updatedAt) return -1
      return 0
    })[0]
  }
)
