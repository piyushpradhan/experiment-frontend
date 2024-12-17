import type { Action } from '@messaging/types'

import * as atypes from '@messaging/store/actionTypes'
import { SetSourcePayload } from '@messaging/store/actions/types'
import { Source } from '@messaging/types'

export const setSource = (
  source: Source
): Action<string, SetSourcePayload> => ({
  type: atypes.SET_SOURCE,
  payload: {
    source,
  },
})
