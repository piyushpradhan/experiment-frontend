import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Messages from '@messaging/components/Message/Messages'
import ChannelList from '@messaging/components/Channel/ChannelList'
import CreateChannelModal from '@messaging/components/Channel/CreateChannelModal'
import MessageInput from '@messaging/components/MessageInput/index'
import Members from '@messaging/components/Members'

import { setActiveChannel } from '@messaging/store/actions/index'
import {
  getAllChannels,
  getLatestChannel,
} from '@messaging/store/selectors/index'

import type { AppState } from '@messaging/types'
import { setActiveUser } from '@messaging/store/actions/user'

const Messaging = () => {
  const dispatch = useDispatch()

  const channels = useSelector((state: AppState) => getAllChannels(state))
  const latestChannel = useSelector((state: AppState) =>
    getLatestChannel(state)
  )

  useEffect(() => {
    if (channels.length > 0) {
      const storedUser = localStorage.getItem('user')
      dispatch(setActiveChannel(latestChannel.id))
      if (storedUser) {
        dispatch(setActiveUser(storedUser))
      }
    }
  }, [channels])

  return (
    <main className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6 h-screen max-h-screen overflow-hidden">
      <div
        className="grid grid-cols-5 lg:grid-cols-6 2xl:grid-cols-9 gap-4 rounded-lg w-full h-full overflow-hidden"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col gap-1 col-span-2 2xl:col-span-2 border">
          <div className="p-4 flex flex-row justify-between items-center border-b">
            <h2 className="md:text-lg 2xl:text-2xl font-bold">Messages</h2>
            <CreateChannelModal />
          </div>
          <ChannelList />
        </div>
        <div className="col-span-3 2xl:col-span-6 border flex flex-col h-full overflow-hidden">
          <Messages />
          <MessageInput />
        </div>
        <div className="hidden lg:col-span-1 border lg:flex flex-col p-2 2xl:p-4 gap-2">
          <Members />
        </div>
      </div>
    </main>
  )
}

export default Messaging
