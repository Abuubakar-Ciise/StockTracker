import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const metrics = [
  { label: "Total Revenue", value: "$128,400", delta: "+12.4% vs last month" },
  { label: "Active Products", value: "348", delta: "+18 new this week" },
  { label: "Low Stock", value: "23", delta: "Restock recommended" },
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {metric.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-2xl font-semibold">{metric.value}</p>
            <Separator />
            <p className="text-xs text-muted-foreground">{metric.delta}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

