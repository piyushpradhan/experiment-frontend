import { useSelector } from 'react-redux'
import { getUserDetails } from '@messaging/store/selectors'
import { AppState, User } from '@messaging/types'

type Props = {
  isOwnMessage: boolean
  uid: string
}

const MessageAuthor = ({ isOwnMessage, uid }: Props) => {
  const user: User = useSelector((state: AppState) =>
    getUserDetails(state, uid)
  )

  if (isOwnMessage || uid === 'null') return null

  return <p className="text-xs text-muted-foreground">{user.name}</p>
}

export default MessageAuthor
