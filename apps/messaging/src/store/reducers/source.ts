import * as atypes from '@messaging/store/actionTypes'
import { Action } from '@messaging/types'
import { SetSourcePayload } from '@messaging/store/actions/types'

const selectedSource = (state = 'socket', action: Action<string, unknown>) => {
  switch (action.type) {
    case atypes.SET_SOURCE: {
      const { payload }: Action<string, SetSourcePayload> = action as Action<
        string,
        SetSourcePayload
      >
      return payload.source
    }
    default:
      return state
  }
}

export default selectedSource
