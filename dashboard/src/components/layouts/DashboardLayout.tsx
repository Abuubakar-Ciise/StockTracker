import { Outlet } from "react-router-dom"
import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30">
        <AppSidebar layout="dashboard" />

        <SidebarInset>
          <header className="flex h-14 items-center gap-3 border-b bg-background px-4">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button variant="ghost" size="icon">
              <Bell className="size-4" />
            </Button>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

