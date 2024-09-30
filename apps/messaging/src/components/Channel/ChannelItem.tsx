import { useDispatch, useSelector } from 'react-redux'

import { setActiveChannel } from '@messaging/store/actions'
import { getChannelDetails, getActiveChannel } from '@messaging/store/selectors'

import type { Channel, AppState } from '@messaging/types'
import ChannelDropdown from './ChannelDropdown'
import { useSocket } from '@messaging/store/hooks'

type Props = {
  channelId: string
}

const Channel = ({ channelId }: Props) => {
  const dispatch = useDispatch()
  const { joinChannel } = useSocket()
  const channel = useSelector((state: AppState) =>
    getChannelDetails(state, channelId)
  )

  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )

  const handleJoinChannel = () => {
    joinChannel(channelId)
    dispatch(setActiveChannel(channelId))
  }

  return (
    <div
      className={`flex flex-col cursor-pointer gap-1 px-3 mx-1 py-2 ${
        activeChannel === channelId
          ? 'bg-gray-100 border'
          : 'bg-white border border-transparent'
      } hover:bg-gray-100 rounded-sm`}
      onClick={handleJoinChannel}
    >
      <div className="pt-1 flex flex-row justify-between items-center">
        <h3 className="font-semibold leading-3">{channel.name}</h3>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xs text-gray-500 line-clamp-1">
          {channel.lastMessage}
        </p>
        <ChannelDropdown channelId={channelId} />
      </div>
    </div>
  )
}

export default Channel
