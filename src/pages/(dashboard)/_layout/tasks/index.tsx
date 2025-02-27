import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/_layout/tasks/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(dashboard)/_layout/tasks/"!</div>;
}
