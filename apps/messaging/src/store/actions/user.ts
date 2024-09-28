import * as atypes from '@messaging/store/actionTypes'
import type { Action, User } from '@messaging/types'
import type {
  CreateUserPayload,
  CreatedUserPayload,
  SetActiveUserPayload,
  UpdateAllUsersPayload,
} from '@messaging/store/actions/types'

export const createUserOptimistic = ({
  name,
  email,
}: CreateUserPayload): Action<string, unknown> => ({
  type: atypes.CREATE_USER_OPTIMISTIC,
  payload: {
    name,
    email,
  },
})

export const storeCreatedUser = ({
  uid,
  name,
  email,
}: CreatedUserPayload): Action<string, CreatedUserPayload> => ({
  type: atypes.CREATE_USER,
  payload: {
    uid,
    name,
    email,
  },
})

export const updateAllUsers = (
  users: User[]
): Action<string, UpdateAllUsersPayload> => ({
  type: atypes.UPDATE_ALL_USERS,
  payload: {
    users,
  },
})

export const setActiveUser = (
  uid: string
): Action<string, SetActiveUserPayload> => ({
  type: atypes.SET_ACTIVE_USER,
  payload: {
    user: uid,
  },
})
