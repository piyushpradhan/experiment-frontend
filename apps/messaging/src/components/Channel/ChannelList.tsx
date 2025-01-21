import { useSelector } from 'react-redux'

import Channel from '@messaging/components/Channel/ChannelItem.tsx'

import { getAllChannels, getSortedChannels } from '@messaging/store/selectors'

import type { AppState } from '@messaging/types'
import NoChannels from './NoChannels'

const ChannelList = () => {
  const channels = useSelector((state: AppState) => getAllChannels(state))
  const sortedChannels = useSelector((state: AppState) =>
    getSortedChannels(state)
  )

  if (channels.length == 0) {
    return <NoChannels />
  }

  return sortedChannels.map((channel: Channel) => (
    <Channel key={channel.id} channelId={channel.id} />
  ))
}

export default ChannelList
