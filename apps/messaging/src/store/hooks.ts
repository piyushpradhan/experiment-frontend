import { useContext } from 'react'
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux'

import { SocketContext } from '@messaging/store/socket'

import type { AppDispatch, RootState } from '.'

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>()
export const useSelector = useReduxSelector.withTypes<RootState>()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used with a SocketProvider')
  }

  return context
}
