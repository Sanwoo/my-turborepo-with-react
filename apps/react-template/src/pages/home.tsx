import { Button } from '@workspace/ui/components/button'

export const HomePage = () => {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">React + Vite</h1>
        <p className="text-muted-foreground text-sm">Built with React Router and the shared UI package.</p>
        <Button size="sm">Button</Button>
      </div>
    </div>
  )
}
