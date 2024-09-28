import { useSelector } from 'react-redux'
import { Reply, X } from 'lucide-react'

import { getTaggedMessage } from '@messaging/store/selectors'

import type { AppState, Message } from '@messaging/types'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { tagMessage } from '@messaging/store/actions'

const TaggedMessage = () => {
  const dispatch = useDispatch()
  const taggedMessage: Message | null = useSelector((state: AppState) =>
    getTaggedMessage(state)
  )

  const handleTagClear = useCallback(() => {
    dispatch(tagMessage(null))
  }, [])

  if (!taggedMessage) {
    return null
  }

  return (
    <div className="bg-white w-full p-2 border rounded-md flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <Reply className="w-4 h-4" />
          <p className="text-xs">Reply to</p>
        </div>
        <X className="w-4 h-4 cursor-pointer" onClick={handleTagClear} />
      </div>
      <div className="p-1 bg-secondary text-sm text-gray-600 rounded-sm">
        {taggedMessage.contents}
      </div>
    </div>
  )
}

export default TaggedMessage
