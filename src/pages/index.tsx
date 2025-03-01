import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async () => {
    return redirect({
      to: "/welcome",
    });
  },
});

function RouteComponent() {
  return <div>Hello "/"!</div>;
}
