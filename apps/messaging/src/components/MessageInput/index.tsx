import { useRef, KeyboardEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Send } from 'lucide-react'

import { Input } from '@messaging/components/ui/input'
import { Button } from '@messaging/components/ui/button'
import JoinModal from '@messaging/components/MessageInput/JoinModal'
import TaggedMessage from '@messaging/components/MessageInput/TaggedMessage'

import { useKafka, useSocket } from '@messaging/store/hooks'
import { tagMessage } from '@messaging/store/actions'
import {
  getActiveChannel,
  getActiveUser,
  getSelectedSource,
  getTaggedMessageId,
} from '@messaging/store/selectors'

import type { AppState } from '@messaging/types'

const MessageInput = () => {
  const dispatch = useDispatch()
  const { sendMessage: sendSocketMessage } = useSocket()
  const { sendMessage: sendKafkaMessage } = useKafka()
  const inputRef = useRef<HTMLInputElement>(null)

  const activeUser = useSelector((state: AppState) => getActiveUser(state))
  const activeChannel = useSelector((state: AppState) =>
    getActiveChannel(state)
  )
  const taggedMessageId = useSelector((state: AppState) =>
    getTaggedMessageId(state)
  )
  const selectedSource = useSelector((state: AppState) =>
    getSelectedSource(state)
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (inputRef.current) {
        handleSendMessage()
        dispatch(tagMessage(null))
      }
    }
  }

  const handleSendMessage = () => {
    if (selectedSource === 'kafka') {
      sendKafkaMessage(inputRef, activeChannel, activeUser, taggedMessageId)
    } else {
      sendSocketMessage(inputRef, activeChannel, activeUser, taggedMessageId)
    }
    dispatch(tagMessage(null))
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="pb-2 px-2 flex flex-col justify-center items-center">
      <TaggedMessage />
      {!activeUser ? (
        <JoinModal />
      ) : (
        <div className="flex w-full items-center space-x-2">
          <Input
            ref={inputRef}
            type="email"
            placeholder="Type your message..."
            onKeyDown={handleKeyDown}
          />
          <Button type="submit" className="p-4" onClick={handleSendMessage}>
            <Send className="w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default MessageInput
