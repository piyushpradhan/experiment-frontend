import { backendUrl } from '@messaging/lib/utils'

export const fetchChannelMessages = async (channelId: string) => {
  try {
    const response = await fetch(`${backendUrl}/message/${channelId}`)
    return response.json()
  } catch (err) {
    console.error(err)
    return {}
  }
}

export const fetchMoreMessages = async (
  channelId: string,
  offset: number,
  limit: number
) => {
  try {
    const response = await fetch(
      `${backendUrl}/message/${channelId}/more?offset=${offset}&limit=${limit}`
    )
    return response.json()
  } catch (err) {
    console.error(err)
    return {}
  }
}
