import './App.css'
import { Provider } from 'react-redux'
import { useEffect, useState } from 'react'

import { checkHealth } from '@messaging/api/health'
import { store } from '@messaging/store'
import SocketProvider from '@messaging/store/socket'
import KafkaProvider from '@messaging/store/kafka'

import Messaging from '@messaging/components/Views/Messaging'
import LoaderOverlay from '@messaging/components/LoaderOverlay'

import {
  LOADING_MESSAGE,
  FAILED_TO_LOAD_MESSAGE,
} from '@messaging/lib/contants'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGE)

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const isHealthy = await checkHealth()
      if (isHealthy) {
        setIsLoading(false)
        clearInterval(intervalId)
      }
    }, 5000)

    // Stop checking after 30 seconds
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      setLoadingMessage(FAILED_TO_LOAD_MESSAGE)
    }, 30000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [])

  const handleHideLoader = () => {
    setIsLoading(false)
  }

  return (
    <Provider store={store}>
      <KafkaProvider>
        <SocketProvider>
          {isLoading &&
          (loadingMessage === LOADING_MESSAGE ||
            loadingMessage === FAILED_TO_LOAD_MESSAGE) ? (
            <LoaderOverlay message={loadingMessage} onHide={handleHideLoader} />
          ) : (
            <Messaging />
          )}
        </SocketProvider>
      </KafkaProvider>
    </Provider>
  )
}

export default App
