import * as fromChannel from './channel'
import * as fromMessage from './message'
import * as fromUser from './user'
import * as fromSource from './source'

import type { AppState } from '@messaging/types'

export const getActiveChannel = (state: AppState) =>
  fromChannel.getActiveChannel(state.channel)
export const getAllChannels = (state: AppState) =>
  fromChannel.getAllChannels(state.channel)
export const getAllChannelDetails = (state: AppState) =>
  fromChannel.getAllChannelDetails(state.channel)
export const getActiveChannelDetails = (state: AppState) =>
  fromChannel.getActiveChannelDetails(state.channel)
export const getChannelDetails = (state: AppState, channelId: string) =>
  fromChannel.getChannelDetails(state.channel, channelId)
export const getLatestChannel = (state: AppState) =>
  fromChannel.getLatestChannel(state.channel)
export const getSortedChannels = (state: AppState) =>
  fromChannel.getSortedChannels(state.channel)

export const getAllMessages = (state: AppState) =>
  fromMessage.getAllMessages(state.message)
export const getMessagesById = (state: AppState) =>
  fromMessage.getMessagesById(state.message)

export const getMessage = (state: AppState, messageId: string | null) =>
  fromMessage.getMessage(state.message, messageId)
export const getMessagesGroupedBySender = (state: AppState) =>
  fromMessage.getMessagesGroupedBySender(state.message)

export const getTaggedMessageId = (state: AppState) =>
  fromMessage.getTaggedMessageId(state.message)
export const getTaggedMessage = (state: AppState) =>
  fromMessage.getTaggedMessage(state.message)

export const getUsersById = (state: AppState) =>
  fromUser.getUsersById(state.user)
export const getUserDetails = (state: AppState, uid: string) =>
  fromUser.getUserDetails(state.user, uid)
export const getActiveUser = (state: AppState) =>
  fromUser.getActiveUser(state.user)

export const getSelectedSource = (state: AppState) =>
  fromSource.getSelectedSource(state.source)
