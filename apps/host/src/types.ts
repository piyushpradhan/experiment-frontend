export type Message = {
  id: string
  sender: string
  contents: string
  channelId: string
  timestamp: Date
  taggedMessage?: string
}

export type MessageSocketResponse = Omit<Message, 'channelId'> & {
  channel_id: string
  tagged_message?: string
}

export type MessagesById = {
  [messageId: string]: Message
}

export type TaggedMessage = string | null

export type MessagesState = {
  taggedMessage: TaggedMessage
  byId: MessagesById
  all: string[]
}

export type ChannelSocketResponse = {
  id: string
  name: string
  created_at: string
  last_message: string
  updated_at: Date
}

export type Channel = {
  id: string
  name: string
  createdAt: string
  lastMessage: string
  updatedAt: Date
}

export type Action<T extends string, P> = {
  type: T
  payload: P
}

export type ChannelsById = {
  [channelId: string]: Channel
}

export type ChannelState = {
  activeChannel: string
  byId: ChannelsById
  all: string[]
}

export type TabState = {
  activeTab: string
}

export type User = {
  uid: string
  name: string
  email: string
}

export type UsersById = {
  [uid: string]: User
}

export type ActiveUser = string | null

export type UserState = {
  byId: UsersById
  active: ActiveUser
}

export type AppState = {
  channel: ChannelState
  tab: TabState
  message: MessagesState
  user: UserState
}
