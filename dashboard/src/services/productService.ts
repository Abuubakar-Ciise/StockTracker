import api from '@/services/api'
import type { Product, ProductFilters } from '@/store/productStore'

export type ProductListResponse = {
  products: Product[]
  pagination: {
    total: number
    totalPages: number
  }
}

// GET /products with search, filter, sort, pagination
export const fetchProductsApi = async (filters: ProductFilters): Promise<ProductListResponse> => {
  const params: Record<string, string | number> = {
    page: filters.page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  }

  if (filters.search) params.search = filters.search
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice
  if (filters.minQuantity !== undefined) params.minQuantity = filters.minQuantity
  if (filters.maxQuantity !== undefined) params.maxQuantity = filters.maxQuantity

  const response = await api.get('/products', { params })
  return {
    products: response.data.products ?? [],
    pagination: {
      total: response.data.pagination?.total ?? 0,
      totalPages: response.data.pagination?.totalPages ?? 0,
    },
  }
}

// GET /products/:id
export const getProductByIdApi = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`)
  return response.data as Product
}

export type CreateProductInput = {
  name: string
  description?: string
  price: number
  quantity?: number
  image?: string | File | null
}

// POST /products
export const createProductApi = async (input: CreateProductInput): Promise<Product> => {
  // If image is a File, use FormData, otherwise send JSON
  const hasFileImage = input.image instanceof File

  if (hasFileImage) {
    const formData = new FormData()
    formData.append('name', input.name)
    if (input.description) formData.append('description', input.description)
    formData.append('price', String(input.price))
    if (input.quantity !== undefined) formData.append('quantity', String(input.quantity))
    if (input.image instanceof File) formData.append('image', input.image)

    const response = await api.post('/products', formData)
    return response.data as Product
  }

  const response = await api.post('/products', {
    name: input.name,
    description: input.description,
    price: input.price,
    quantity: input.quantity,
    image: typeof input.image === 'string' ? input.image : undefined,
  })
  return response.data as Product
}

export type UpdateProductInput = Partial<Omit<CreateProductInput, 'name'>> & {
  name?: string
}

// PUT /products/:id
export const updateProductApi = async (id: string, input: UpdateProductInput): Promise<Product> => {
  const hasFileImage = input.image instanceof File

  if (hasFileImage) {
    const formData = new FormData()
    if (input.name !== undefined) formData.append('name', input.name)
    if (input.description !== undefined) formData.append('description', input.description)
    if (input.price !== undefined) formData.append('price', String(input.price))
    if (input.quantity !== undefined) formData.append('quantity', String(input.quantity))
    if (input.image instanceof File) formData.append('image', input.image)

    const response = await api.put(`/products/${id}`, formData)
    return response.data as Product
  }

  const body: Record<string, unknown> = {}
  if (input.name !== undefined) body.name = input.name
  if (input.description !== undefined) body.description = input.description
  if (input.price !== undefined) body.price = input.price
  if (input.quantity !== undefined) body.quantity = input.quantity
  if (typeof input.image === 'string') body.image = input.image

  const response = await api.put(`/products/${id}`, body)
  return response.data as Product
}

// DELETE /products/:id
export const deleteProductApi = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`)
}

