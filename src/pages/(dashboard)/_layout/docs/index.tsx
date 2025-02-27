import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/_layout/docs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/_layout/docs/"!</div>
}
