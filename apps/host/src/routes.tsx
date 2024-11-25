import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import Home from '@/pages/Home'

// eslint-disable-next-line react-refresh/only-export-components
const Messaging = lazy(() => import('@messaging/App'))
// eslint-disable-next-line react-refresh/only-export-components
const Collaboration = lazy(() => import('@collaboration/index'))

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
        loader: () => redirect('/messaging'),
      },
      {
        path: 'collaboration',
        element: <Collaboration />,
        loader: () => redirect('/collaboration'),
      },
    ],
  },
])

export default router
