import { useSelector } from 'react-redux'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@messaging/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@messaging/components/ui/tooltip'
import { getUsersById } from '@messaging/store/selectors'

import { AppState } from '@messaging/types'
import { useEffect } from 'react'
import { getAllUsers } from '@messaging/api/user'
import { useDispatch } from 'react-redux'
import { updateAllUsers } from '@messaging/store/actions/user'

const Members = () => {
  const dispatch = useDispatch()

  const usersById = useSelector((state: AppState) => getUsersById(state))

  useEffect(() => {
    getAllUsers().then((users) => {
      dispatch(updateAllUsers(users))
    })
  }, [])

  return (
    <>
      <h1 className="text-sm 2xl:text-lg p-2 2xl:p-0 font-bold">Members</h1>
      <div className="flex flex-col gap-1">
        {Object.keys(usersById).map((userId: string) => (
          <TooltipProvider key={userId}>
            <Tooltip>
              <div className="flex flex-row gap-2 p-1 2xl:p-2 justify-start items-center">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {usersById[userId].name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <TooltipTrigger asChild>
                  <p className="font-semibold text-ellipsis line-clamp-1 text-xs lg:text-sm 2xl:text-md">
                    {usersById[userId].name}
                  </p>
                </TooltipTrigger>
              </div>
              <TooltipContent>
                <p>{usersById[userId].name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </>
  )
}

export default Members
