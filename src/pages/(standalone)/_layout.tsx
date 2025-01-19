import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(standalone)/_layout")({
  component: StandaloneLayout,
});

function StandaloneLayout() {
  return (
    <main className=" bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <div className=" flex flex-col items-center justify-center py-4">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
