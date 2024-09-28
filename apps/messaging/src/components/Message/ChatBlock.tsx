import { useSelector } from 'react-redux'

import MessageDropdown from '@messaging/components/Message/MessageDropdown'
import { getMessage } from '@messaging/store/selectors'

import { Message as MessageType, AppState, Message } from '@messaging/types'
import MessageAuthor from './MessageAuthor'

type Props = {
  message: MessageType
  uid: string
}

const ChatBlock = ({ message, uid }: Props) => {
  const isOwnMessage = uid === message.sender
  const taggedMessage: Message | null = useSelector((state: AppState) =>
    getMessage(state, message.taggedMessage ?? null)
  )

  return (
    <div
      className={`w-full flex group gap-2 ${
        isOwnMessage
          ? 'justify-start flex-row'
          : 'justify-start flex-row-reverse'
      } group`}
    >
      <div
        className={`flex flex-col gap-1 ${
          isOwnMessage ? 'items-start' : 'items-end'
        }`}
      >
        <MessageAuthor uid={message.sender} isOwnMessage={isOwnMessage} />
        {taggedMessage && (
          <div
            className={`flex gap-1 ${
              isOwnMessage ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className="h-full w-1 bg-gray-500 rounded-full"></div>
            <p className="text-white text-xs bg-gray-500 rounded-full p-1 px-2">
              {taggedMessage?.contents}
            </p>
          </div>
        )}
        <div
          className={`relative flex flex-col justify-center items-start py-1 px-3 ${
            taggedMessage ? 'rounded-2xl' : 'rounded-full'
          } max-w-fit ${
            uid === message.sender ? 'bg-black' : 'bg-gray-200'
          } gap-1`}
        >
          <p
            className={`text-sm ${
              uid === message.sender ? 'text-white' : 'text-black'
            }`}
          >
            {message.contents}
          </p>
          <MessageDropdown messageId={message.id} isOwnMessage={isOwnMessage} />
        </div>
      </div>
    </div>
  )
}

export default ChatBlock
