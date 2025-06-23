import React, { Suspense } from 'react'
import { Loader } from 'shared-components'

// Dynamic import of the messaging app
const MessagingApp = React.lazy(() => import('../../../messaging/src/App'))

const Messaging: React.FC = () => {
  return (
    <Suspense fallback={<Loader message="Loading messaging app..." />}>
      <MessagingApp />
    </Suspense>
  )
}

export default Messaging
