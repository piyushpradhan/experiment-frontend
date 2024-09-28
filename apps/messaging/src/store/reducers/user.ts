import { combineReducers } from '@reduxjs/toolkit'

import {
  CreateUserPayload,
  CreatedUserPayload,
  SetActiveUserPayload,
  UpdateAllUsersPayload,
} from '../../store/actions/types'

import * as atypes from '../../store/actionTypes'
import type { UsersById, Action, ActiveUser, User } from '@messaging/types'

const active = (state: ActiveUser = null, action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.CREATE_USER: {
      const { payload }: Action<string, CreatedUserPayload> = action as Action<
        string,
        CreatedUserPayload
      >
      return payload.uid
    }
    case atypes.SET_ACTIVE_USER: {
      const { payload }: Action<string, SetActiveUserPayload> =
        action as Action<string, SetActiveUserPayload>

      return payload.user
    }
    default:
      return state
  }
}

const byId = (state: UsersById = {}, action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.UPDATE_ALL_USERS: {
      const { payload }: Action<string, UpdateAllUsersPayload> =
        action as Action<string, UpdateAllUsersPayload>

      const usersByUID: UsersById = {}

      ;(payload.users || []).forEach((user: User) => {
        usersByUID[user.uid] = user
      })

      return usersByUID
    }
    case atypes.CREATE_USER_OPTIMISTIC: {
      const { payload }: Action<string, CreateUserPayload> = action as Action<
        string,
        CreateUserPayload
      >

      return {
        ...state,
        temp: {
          name: payload.name,
          email: payload.email,
        },
      }
    }
    case atypes.CREATE_USER: {
      const { payload }: Action<string, CreatedUserPayload> = action as Action<
        string,
        CreatedUserPayload
      >
      const updated = { ...state }
      updated['temp'] = payload

      return updated
    }
    default:
      return state
  }
}

const userReducer = combineReducers({
  byId,
  active,
})

export default userReducer
