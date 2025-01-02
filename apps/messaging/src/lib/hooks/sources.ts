import { useContext } from 'react'
import { SocketContext } from '@messaging/store/socket'
import { KafkaContext } from '@messaging/store/kafka'

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  return context
}

export const useKafka = () => {
  const context = useContext(KafkaContext)
  if (!context) {
    throw new Error('useKafka must be used within a KafkaProvider')
  }

  return context
}
