import { Outlet } from "react-router-dom"
import { Filter, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"

export function ProductLayout() {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar layout="products" />

        <SidebarInset>
          <header className="flex flex-wrap gap-2 border-b bg-background px-4 py-3">
            <div className="flex flex-1 items-center gap-2">
              <SidebarTrigger />
              {/* <div className="flex items-center gap-2">
                <Search className="size-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="h-8 w-48 md:w-72"
                />
              </div> */}
            </div>
            <div className="flex items-center gap-2">
              {/* <Button variant="outline" size="sm">
                <Filter className="mr-2 size-4" />
                Filters
              </Button> */}
              {/* <Button size="sm">
                <Plus className="mr-2 size-4" />
                New Product
              </Button> */}
            </div>
          </header>

          <main className="w-full p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

