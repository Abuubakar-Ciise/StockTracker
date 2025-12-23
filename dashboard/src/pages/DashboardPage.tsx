import { OverviewCards } from "@/views/dashboard/OverviewCards"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <h1 className="text-2xl font-semibold">Business overview</h1>
      </div>
      <OverviewCards />
    </div>
  )
}

