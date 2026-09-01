import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link className="text-primary text-sm underline underline-offset-4" to="/">
        Return home
      </Link>
    </div>
  )
}
