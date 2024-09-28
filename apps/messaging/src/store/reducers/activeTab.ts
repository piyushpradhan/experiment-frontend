import * as atypes from '../../store/actionTypes'
import { combineReducers } from '@reduxjs/toolkit'

const activeTabInitialState = 'messaging'
const activeTab = (
  state = activeTabInitialState,
  action: { type: string; payload: unknown }
) => {
  switch (action.type) {
    case atypes.SET_ACTIVE_TAB:
      return action.payload
    default:
      return state
  }
}

const tabReducer = combineReducers({
  activeTab,
})

export default tabReducer
