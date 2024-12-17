import { combineReducers } from '@reduxjs/toolkit'
import tab from './activeTab'
import channel from './channel'
import message from './message'
import user from './user'
import source from './source'

const rootReducer = combineReducers({
  tab,
  channel,
  message,
  user,
  source,
})

export default rootReducer
