import { createBrowserRouter, RouterProvider } from 'react-router'

import { AppLayout } from '@/app/layout'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
