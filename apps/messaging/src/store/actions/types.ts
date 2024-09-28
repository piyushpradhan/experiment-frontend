import { MessageSocketResponse, User } from '@messaging/types'

export type SetChannelMessagesPayload = {
  messages: MessageSocketResponse[]
  channelId: string
  isSwitchingChannels: boolean
}

export type TagMessagePayload = {
  messageId: string | null
}

export type CreateUserPayload = {
  name: string
  email: string
}

export type CreatedUserPayload = User

export type UpdateAllUsersPayload = {
  users: User[]
}

export type SetActiveUserPayload = {
  user: string
}
