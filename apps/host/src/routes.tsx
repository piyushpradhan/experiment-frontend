import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import Home from '@/pages/Home'

// Import apps as packages - enterprise standard approach
const Messaging = lazy(() => import('@experiment/messaging-app'))
const Collaboration = lazy(() => import('@experiment/collaboration-app'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
        loader: () => redirect('/messaging'),
      },
      {
        path: 'messaging',
        element: <Messaging />,
        loader: () => {
          return null
        },
      },
      {
        path: 'collaboration',
        element: <Collaboration />,
        loader: () => {
          return null
        },
      },
    ],
  },
])

export default router
