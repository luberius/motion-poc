import * as React from "react";
import {
  IconChartDots,
  IconDashboard,
  IconForms,
  IconInnerShadowTop,
  IconLoader3,
  IconNavigation,
  IconNotification,
  IconPointer,
  IconReport,
  IconSearch,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Form",
      url: "/poc/list",
      icon: IconForms,
    },
  ],
  navSecondary: [
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Micro Interactions",
      url: "/poc/microinteractions",
      icon: IconPointer,
    },
    {
      name: "Data Visualization",
      url: "/poc/dataviz",
      icon: IconChartDots,
    },
    {
      name: "Subtle Loading",
      url: "/poc/loading",
      icon: IconLoader3,
    },
    {
      name: "Contextual Navigation",
      url: "/poc/navigations",
      icon: IconNavigation,
    },
    {
      name: "Notification System",
      url: "/poc/notification",
      icon: IconNotification,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SPS Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
