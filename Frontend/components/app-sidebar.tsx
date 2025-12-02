"use client";

import * as React from "react";
import {
  BookOpen,
  LayoutDashboard,
  TrendingUp,
  Upload,
  FileVideo,
  Shield,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";
import WalletConnect from "@/components/WalletConnect";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppStore();

  const navMain = [
    {
      title: "Platform",
      url: "#",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Courses",
          url: "/courses",
        },
        {
          title: "Trending",
          url: "/trending",
        },
      ],
    },
  ];

  const creatorItems = [
    {
      name: "Upload Course",
      url: "/creator/upload",
      icon: Upload,
    },
    {
      name: "My Courses",
      url: "/creator/my-courses",
      icon: FileVideo,
    },
  ];

  const adminItems = [
    {
      name: "Admin Panel",
      url: "/admin",
      icon: Shield,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">BlockedLearning</span>
                  <span className="truncate text-xs">Camp Network</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={creatorItems} />
        {user?.role === "admin" && <NavProjects projects={adminItems} />}
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <NavUser user={{
            name: user.walletAddress.slice(0, 6) + "..." + user.walletAddress.slice(-4),
            email: user.role,
            avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.walletAddress}`,
          }} />
        ) : (
          <div className="p-2">
            <WalletConnect />
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
