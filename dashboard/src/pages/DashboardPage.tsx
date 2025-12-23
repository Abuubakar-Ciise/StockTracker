import { useEffect } from "react"

import { useAnalyticsStore } from "@/store/analyticsStore"
import { OverviewCards } from "@/views/dashboard/OverviewCards"
import { CategoryBreakdownChart } from "@/views/dashboard/CategoryBreakdownChart"
import { SalesTrendChart } from "@/views/dashboard/SalesTrendChart"
import { TopProductsTable } from "@/views/dashboard/TopProductsTable"

export default function DashboardPage() {
  const {
    summary,
    stockByProduct,
    loadingSummary,
    loadingStockByProduct,
    fetchSummary,
    fetchStockByProduct,
  } = useAnalyticsStore()

  useEffect(() => {
    fetchSummary()
    fetchStockByProduct()
  }, [fetchSummary, fetchStockByProduct])

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <h1 className="text-2xl font-semibold">Business overview</h1>
      </div>

      <OverviewCards summary={summary} loading={loadingSummary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart items={stockByProduct} loading={loadingStockByProduct} />
        </div>
        <CategoryBreakdownChart
          items={stockByProduct}
          loading={loadingStockByProduct}
        />
      </div>

      <TopProductsTable
        items={stockByProduct}
        loading={loadingStockByProduct}
      />
    </div>
  )
}

