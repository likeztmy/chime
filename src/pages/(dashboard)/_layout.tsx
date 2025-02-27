import { DashboardSidebar } from "@/components/common/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryUserListModal } from "@/feature/user/components/query-user-list-modal";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/_layout")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="max-h-screen w-screen">
        <QueryUserListModal />
        <div className="flex w-full h-full bg-[#ededed] overflow-hidden">
          <DashboardSidebar />
          <div className="h-[calc(100%-1rem)] flex-1 m-2 bg-[#fbfbfb] rounded-[4px] border border-[#e0e0e0] overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
