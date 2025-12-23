import { ProductTable } from "@/views/products/ProductTable"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Products</p>
        <h1 className="text-2xl font-semibold">Inventory</h1>
      </div>
      <ProductTable />
    </div>
  )
}

