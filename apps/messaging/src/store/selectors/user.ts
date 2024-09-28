import { UserState } from '@messaging/types'
import { createSelector } from 'reselect'

import { UsersById } from '@messaging/types'

export const getUsersById = (state: UserState) => state.byId
export const getUserDetails = createSelector(
  [getUsersById, (_, userId: string) => userId],
  (usersById: UsersById, uid: string) => {
    return usersById[uid]
  }
)
export const getActiveUser = (state: UserState) => state.active
