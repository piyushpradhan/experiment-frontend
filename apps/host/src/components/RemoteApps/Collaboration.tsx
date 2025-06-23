import React, { Suspense } from 'react'
import { Loader } from 'shared-components'

// Dynamic import of the collaboration app
const CollaborationApp = React.lazy(
  () => import('../../../collaboration/src/index')
)

const Collaboration: React.FC = () => {
  return (
    <Suspense fallback={<Loader message="Loading collaboration app..." />}>
      <CollaborationApp />
    </Suspense>
  )
}

export default Collaboration
