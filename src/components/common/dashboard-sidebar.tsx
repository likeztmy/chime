import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, redirect, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  CircleCheck,
  ChevronsUpDown,
  LogOut,
  BookText,
  MessageCircle,
  UserIcon,
} from "lucide-react";
import { useUserStore } from "@/feature/user/store";
import { toast } from "sonner";

const menuItems = [
  // {
  //   title: "主页",
  //   icon: House,
  //   url: "/welcome",
  //   isActive: true,
  // },
  {
    title: "私信",
    icon: MessageCircle,
    url: "/chat",
    isActive: false,
  },
  {
    title: "云文档",
    icon: BookText,
    url: "/docs",
    isActive: false,
  },
  {
    title: "待办任务",
    icon: CircleCheck,
    url: "/tasks",
    isActive: false,
  },
];

export const DashboardSidebar = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout success!");
    navigate({ to: "/login" });
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-secondary">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary">
                <span className="text-[12px] font-medium text-primary-foreground">
                  {user?.username.charAt(0)}
                </span>
              </div>
              <span className="font-medium">{user?.username}</span>
            </div>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" sideOffset={8}>
            <Link to="/user/profile">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <UserIcon className="h-4 w-4" />
                <span>个人空间</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 py-1">
          <SidebarMenu>
            {menuItems.map((menuItem) => (
              <SidebarMenuItem key={menuItem.title}>
                <SidebarMenuButton
                  className="rounded text-[#2d2d2f] hover:bg-[#dddddd]"
                  asChild
                >
                  <Link href={menuItem.url}>
                    <menuItem.icon className="size-4 stroke-[#58585a]" />
                    <span>{menuItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
