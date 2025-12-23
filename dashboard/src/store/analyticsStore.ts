import { create } from 'zustand'
import {
  getStockSummaryApi,
  getStockByProductApi,
  type StockSummary,
  type StockByProductItem,
} from '@/services/analyticsService'

type AnalyticsState = {
  summary: StockSummary | null
  stockByProduct: StockByProductItem[]
  loadingSummary: boolean
  loadingStockByProduct: boolean
  error: string | null
  fetchSummary: () => Promise<void>
  fetchStockByProduct: () => Promise<void>
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  summary: null,
  stockByProduct: [],
  loadingSummary: false,
  loadingStockByProduct: false,
  error: null,

  async fetchSummary() {
    set({ loadingSummary: true, error: null })
    try {
      const summary = await getStockSummaryApi()
      set({ summary, loadingSummary: false })
    } catch (error: any) {
      console.error('Failed to fetch stock summary', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to fetch stock summary',
        loadingSummary: false,
      })
    }
  },

  async fetchStockByProduct() {
    set({ loadingStockByProduct: true, error: null })
    try {
      const { items } = await getStockByProductApi()
      set({ stockByProduct: items, loadingStockByProduct: false })
    } catch (error: any) {
      console.error('Failed to fetch stock by product', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to fetch stock analytics',
        loadingStockByProduct: false,
      })
    }
  },
}))


