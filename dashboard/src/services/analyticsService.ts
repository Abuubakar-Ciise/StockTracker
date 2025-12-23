import api from '@/services/api'

export type StockSummary = {
  totalProducts: number
  totalQuantity: number
  totalInventoryValue: number
  lowStockCount: number
  outOfStockCount: number
}

export type StockByProductItem = {
  id: string
  name: string
  quantity: number
  price: number
  inventoryValue: number
  createdAt: string
  updatedAt: string
}

export type StockByProductResponse = {
  items: StockByProductItem[]
}

// GET /api/analytics/stock-summary
export const getStockSummaryApi = async (): Promise<StockSummary> => {
  const response = await api.get('/analytics/stock-summary')
  return response.data as StockSummary
}

// GET /api/analytics/stock-by-product
export const getStockByProductApi = async (): Promise<StockByProductResponse> => {
  const response = await api.get('/analytics/stock-by-product')
  return response.data as StockByProductResponse
}


