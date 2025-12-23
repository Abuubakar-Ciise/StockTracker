import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockByProductItem } from "@/services/analyticsService"

type CategoryBreakdownChartProps = {
  items: StockByProductItem[]
  loading?: boolean
}

export function CategoryBreakdownChart({ items, loading }: CategoryBreakdownChartProps) {
  const chartData = items
    .slice()
    .sort((a, b) => b.inventoryValue - a.inventoryValue)
    .slice(0, 6)
    .map((item) => ({
      label: item.name,
      inventoryValue: item.inventoryValue,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Inventory Value</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" tick={false} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip />
              <Bar dataKey="inventoryValue" fill="hsl(var(--chart-3))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

