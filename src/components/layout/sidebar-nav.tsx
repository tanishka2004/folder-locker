"use client"

import * as React from "react";
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileSearch2,
  LockKeyhole,
  FileText,
  Type,
  Github,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyze", icon: FileSearch2, label: "Analyze Folder" },
  { href: "/lock-unlock", icon: LockKeyhole, label: "Lock/Unlock Text" },
  { href: "/report", icon: FileText, label: "Generate Report" },
]

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
   // Default to always open on desktop, icon mode for collapsible
  const [defaultOpen, setDefaultOpen] = React.useState(true); 

  React.useEffect(() => {
    // Read sidebar state from cookie on mount for desktop
    if (typeof window !== 'undefined' && window.innerWidth >= 768) { // md breakpoint
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('sidebar_state='))
        ?.split('=')[1];
      if (cookieValue) {
        setDefaultOpen(cookieValue === 'true');
      }
    }
  }, []);


  return (
    <SidebarProvider defaultOpen={defaultOpen} onOpenChange={(open) => {
       if (typeof window !== 'undefined' && window.innerWidth >= 768) {
          setDefaultOpen(open);
       }
    }}>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            {/* Using an inline SVG for a more distinct logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 11.93 3H8.07a2 2 0 0 0-1.66.9l-.82 1.2A2 2 0 0 1 3.93 6H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
              <circle cx="12" cy="13" r="2"></circle>
            </svg>
            <span className="font-semibold text-xl text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              File Fortress
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2 mt-auto">
          {/* Placeholder for potential footer items like settings or user profile */}
          <Separator className="my-2" />
           <div className="flex items-center justify-center group-data-[collapsible=icon]:hidden p-2 text-xs text-sidebar-foreground/70">
             © {new Date().getFullYear()} File Fortress
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Breadcrumbs or page title could go here */}
          </div>
          {/* Optional: User avatar/menu */}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
