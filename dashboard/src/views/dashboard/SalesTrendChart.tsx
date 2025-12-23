import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockByProductItem } from "@/services/analyticsService"

type SalesTrendChartProps = {
  items: StockByProductItem[]
  loading?: boolean
}

export function SalesTrendChart({ items, loading }: SalesTrendChartProps) {
  // Map product inventory into a "trend" by updatedAt (or fallback to index order)
  const chartData = items
    .slice()
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
    .map((item, idx) => ({
      label: item.name || `Item ${idx + 1}`,
      inventoryValue: item.inventoryValue,
      quantity: item.quantity,
    }))
    .slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Value & Quantity</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" hide />
              <YAxis
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="inventoryValue"
                name="Inventory Value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quantity"
                name="Quantity"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

