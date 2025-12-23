import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Package2,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type AppSidebarProps = {
  layout: "dashboard" | "products"
}

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Products", to: "/products", icon: Package2 },
]

export function AppSidebar({ layout }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="space-y-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Stock Tracker</p>
              <p className="text-sm font-semibold capitalize">{layout}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] uppercase">
            beta
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.to}>
                      <Icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-2">
        <Separator />
        <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
          Keyboard: <span className="font-semibold">Ctrl/Cmd + B</span> to
          toggle sidebar
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { SidebarInset }

