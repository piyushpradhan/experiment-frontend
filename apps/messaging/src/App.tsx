import './App.css'
import { Provider } from 'react-redux'

import { store } from '@messaging/store'
import SocketProvider from '@messaging/store/socket'
import KafkaProvider from '@messaging/store/kafka'

import Messaging from '@messaging/components/Views/Messaging'

function App() {
  return (
    <Provider store={store}>
      <KafkaProvider>
        <SocketProvider>
          <Messaging />
        </SocketProvider>
      </KafkaProvider>
    </Provider>
  )
}

export default App
