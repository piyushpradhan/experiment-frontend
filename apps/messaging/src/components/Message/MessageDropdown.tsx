import { useCallback } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { tagMessage } from '@messaging/store/actions'

type Props = {
  messageId: string
  isOwnMessage: boolean
}

const MessageDropdown = ({ messageId, isOwnMessage }: Props) => {
  const dispatch = useDispatch()

  const handleReply = useCallback(() => {
    dispatch(tagMessage(messageId))
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute right-1 outline-none">
        <Ellipsis
          className={`outline-none group-hover:visible invisible w-4 h-4 ${
            isOwnMessage ? 'text-gray-200' : 'text-black'
          } cursor-pointer ${isOwnMessage ? 'bg-black' : 'bg-gray-200'}`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white rounded-md border py-2 flex flex-col items-start shadow-md z-20">
        <DropdownMenuItem
          className="cursor-pointer text-start text-sm hover:bg-gray-200 w-full pl-4 pr-12 py-2"
          onClick={handleReply}
        >
          Reply To
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-start text-sm hover:bg-gray-200 w-full pl-4 pr-12 py-2">
          Delete message
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MessageDropdown
