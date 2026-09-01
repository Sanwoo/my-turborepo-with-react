import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <main className="min-h-svh">
      <Outlet />
    </main>
  )
}
