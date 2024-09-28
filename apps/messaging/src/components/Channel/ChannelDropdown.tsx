import { useCallback } from 'react'
import { ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'

import { useSocket } from '@messaging/store/hooks'

type Props = {
  channelId: string
}

const ChannelDropdown = ({ channelId }: Props) => {
  const { deleteChannel } = useSocket()

  const handleChannelDelete = useCallback(() => {
    deleteChannel(channelId)
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChevronDown className="w-4 h-4 text-gray-500 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-md border py-2 flex flex-col items-start shadow-md z-10">
        <DropdownMenuItem
          className="text-start text-sm hover:bg-gray-200 w-full pl-4 pr-12 py-2"
          onClick={handleChannelDelete}
        >
          Delete channel
        </DropdownMenuItem>
        <DropdownMenuItem className="text-start text-sm hover:bg-gray-200 w-full pl-4 pr-12 py-2">
          Mute notifications
        </DropdownMenuItem>
        <DropdownMenuItem className="text-start text-sm hover:bg-gray-200 w-full pl-4 pr-12 py-2">
          Clear chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ChannelDropdown
