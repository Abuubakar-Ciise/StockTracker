import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockSummary } from "@/services/analyticsService"

type OverviewCardsProps = {
  summary: StockSummary | null
  loading?: boolean
}

export function OverviewCards({ summary, loading }: OverviewCardsProps) {
  const cards = [
    {
      label: "Total Inventory Value",
      value: summary ? `$${summary.totalInventoryValue.toLocaleString()}` : "--",
      delta: summary ? `${summary.totalProducts.toLocaleString()} products` : "",
    },
    {
      label: "Total Quantity",
      value: summary ? summary.totalQuantity.toLocaleString() : "--",
      delta: summary ? `${summary.outOfStockCount} out of stock` : "",
    },
    {
      label: "Low Stock",
      value: summary ? summary.lowStockCount.toLocaleString() : "--",
      delta: summary ? `${summary.outOfStockCount} out of stock` : "",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-7 w-28" />
            ) : (
              <p className="text-2xl font-semibold">{card.value}</p>
            )}
            <Separator />
            {loading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <p className="text-xs text-muted-foreground">{card.delta}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

