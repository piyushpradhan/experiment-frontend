import './App.css'
import { Provider } from 'react-redux'

import { store } from '@messaging/store'
import SocketProvider from '@messaging/store/socket'

import Messaging from './components/Views/Messaging'

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Messaging />
      </SocketProvider>
    </Provider>
  )
}

export default App
