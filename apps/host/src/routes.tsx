import { lazy } from 'react'
import { createBrowserRouter, redirect } from 'react-router-dom'
import Home from '@/pages/Home'

const Messaging = lazy(() => import('@messaging/App'))

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
        path: 'customers',
        element: <div>Customers</div>,
        loader: () => {
          return null
        },
      },
    ],
  },
])

export default router
