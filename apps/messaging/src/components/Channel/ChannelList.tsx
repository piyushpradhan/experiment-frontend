import { memo, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Channel from '@messaging/components/Channel/ChannelItem.tsx'

import { getAllChannels, getSortedChannels } from '@messaging/store/selectors'

import type { AppState } from '@messaging/types'
import { useSocket } from '@messaging/store/hooks'
import NoChannels from './NoChannels'

const ChannelList = memo(() => {
  const { joinChannel } = useSocket()
  const channels = useSelector((state: AppState) => getAllChannels(state))
  const sortedChannels = useSelector((state: AppState) =>
    getSortedChannels(state)
  )

  useEffect(() => {
    console.log('re-rendering')
  }, [sortedChannels])

  if (channels.length == 0) {
    return <NoChannels />
  }

  return sortedChannels.map((channel: Channel) => (
    <Channel
      key={channel.id}
      channelId={channel.id}
      joinChannel={joinChannel}
    />
  ))
})

export default ChannelList
