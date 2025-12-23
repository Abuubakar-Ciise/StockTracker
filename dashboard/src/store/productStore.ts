import { create } from 'zustand'
import {
  fetchProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  type CreateProductInput,
  type UpdateProductInput,
} from '@/services/productService'

export type Product = {
  id: string
  name: string
  description?: string | null
  price: number
  quantity: number
  image?: string | null
  createdAt: string
  updatedAt: string
}

export type ProductFilters = {
  search: string
  minPrice?: number
  maxPrice?: number
  minQuantity?: number
  maxQuantity?: number
  sortBy: 'name' | 'price' | 'quantity' | 'createdAt' | 'updatedAt'
  sortOrder: 'asc' | 'desc'
  page: number
  limit: number
}

type Pagination = {
  total: number
  totalPages: number
}

type ProductState = {
  products: Product[]
  selectedProduct: Product | null
  loading: boolean
  submitting: boolean
  error: string | null
  filters: ProductFilters
  pagination: Pagination
  fetchProducts: () => Promise<void>
  fetchProductById: (id: string) => Promise<void>
  createProduct: (input: CreateProductInput) => Promise<Product | null>
  updateProduct: (id: string, input: UpdateProductInput) => Promise<Product | null>
  deleteProduct: (id: string) => Promise<boolean>
  setSearch: (value: string) => void
  setPage: (page: number) => void
  setSort: (sortBy: ProductFilters['sortBy'], sortOrder: ProductFilters['sortOrder']) => void
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  submitting: false,
  error: null,
  filters: {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  },
  pagination: {
    total: 0,
    totalPages: 0,
  },

  async fetchProducts() {
    const { filters } = get()
    set({ loading: true, error: null })

    try {
      const { products, pagination } = await fetchProductsApi(filters)

      set({
        products,
        pagination,
        loading: false,
      })
    } catch (error: any) {
      console.error('Failed to fetch products', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to fetch products',
        loading: false,
      })
    }
  },

  async fetchProductById(id) {
    set({ loading: true, error: null })
    try {
      const product = await getProductByIdApi(id)
      set({ selectedProduct: product, loading: false })
    } catch (error: any) {
      console.error('Failed to fetch product', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to fetch product',
        loading: false,
      })
    }
  },

  async createProduct(input) {
    set({ submitting: true, error: null })
    try {
      const product = await createProductApi(input)
      // Prepend new product to list and bump total count
      set((state) => ({
        products: [product, ...state.products],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
        submitting: false,
      }))
      return product
    } catch (error: any) {
      console.error('Failed to create product', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to create product',
        submitting: false,
      })
      return null
    }
  },

  async updateProduct(id, input) {
    set({ submitting: true, error: null })
    try {
      const updated = await updateProductApi(id, input)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
        selectedProduct: state.selectedProduct?.id === id ? updated : state.selectedProduct,
        submitting: false,
      }))
      return updated
    } catch (error: any) {
      console.error('Failed to update product', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to update product',
        submitting: false,
      })
      return null
    }
  },

  async deleteProduct(id) {
    set({ submitting: true, error: null })
    try {
      await deleteProductApi(id)
      set((state) => {
        const remaining = state.products.filter((p) => p.id !== id)
        return {
          products: remaining,
          selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
          pagination: {
            ...state.pagination,
            total: Math.max(0, state.pagination.total - 1),
          },
          submitting: false,
        }
      })
      return true
    } catch (error: any) {
      console.error('Failed to delete product', error)
      set({
        error: error?.response?.data?.error ?? 'Failed to delete product',
        submitting: false,
      })
      return false
    }
  },

  setSearch(value) {
    set((state) => ({
      filters: {
        ...state.filters,
        search: value,
        page: 1,
      },
    }))
  },

  setPage(page) {
    set((state) => ({
      filters: {
        ...state.filters,
        page,
      },
    }))
  },

  setSort(sortBy, sortOrder) {
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy,
        sortOrder,
      },
    }))
  },
}))


