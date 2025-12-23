import { useEffect, useMemo, useState } from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Eye,
  Filter,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useProductStore, type Product } from "@/store/productStore"

const currency = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function ProductTable() {
  const {
    products,
    filters,
    loading,
    pagination,
    fetchProducts,
    setSearch,
    setPage,
    setFilters,
    setSort,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [minQty, setMinQty] = useState<string>("")
  const [maxQty, setMaxQty] = useState<string>("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | "view" | "delete">("add")
  const [selected, setSelected] = useState<Product | null>(null)
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
    imageFile: null as File | null,
  })

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Auto-search with debounce on search text changes
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts()
    }, 400)
    return () => clearTimeout(handler)
  }, [filters.search, fetchProducts])

  useEffect(() => {
    if (sorting[0]) {
      const { id, desc } = sorting[0]
      setSort(id as any, desc ? "desc" : "asc")
      fetchProducts()
    }
  }, [sorting, setSort, fetchProducts])

  const openDialog = (mode: typeof dialogMode, product?: Product) => {
    setDialogMode(mode)
    setSelected(product ?? null)
    setFormState({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price?.toString() ?? "",
      quantity: product?.quantity?.toString() ?? "",
      imageUrl: product?.image ?? "",
      imageFile: null,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (dialogMode === "delete" && selected) {
      await deleteProduct(selected.id)
      setDialogOpen(false)
      fetchProducts()
      return
    }

    const payload = {
      name: formState.name,
      description: formState.description,
      price: Number(formState.price || 0),
      quantity: Number(formState.quantity || 0),
      image: formState.imageFile ?? (formState.imageUrl || undefined),
    }

    if (dialogMode === "add") {
      await createProduct(payload)
    } else if (dialogMode === "edit" && selected) {
      await updateProduct(selected.id, payload)
    }
    setDialogOpen(false)
    fetchProducts()
  }

  const columns = useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        id: "image",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Product",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          const text = row.original.description || ""
          return text.length > 15 ? `${text.slice(0, 15)}...` : text
        },
      },
      {
        accessorKey: "quantity",
        header: "Stock",
        cell: ({ getValue }) => getValue<number>()?.toLocaleString(),
        meta: { align: "right" },
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => currency(getValue<number>() ?? 0),
        meta: { align: "right" },
      },
      {
        id: "inventoryValue",
        header: "Inventory Value",
        cell: ({ row }) => currency((row.original.price ?? 0) * (row.original.quantity ?? 0)),
        meta: { align: "right" },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDialog("view", row.original)}
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDialog("edit", row.original)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDialog("delete", row.original)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ),
        meta: { align: "right" },
      },
    ],
    []
  )

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  })

  const applyFilters = () => {
    setFilters({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minQuantity: minQty ? Number(minQty) : undefined,
      maxQuantity: maxQty ? Number(maxQty) : undefined,
      page: 1,
    })
    fetchProducts()
  }

  const clearFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setMinQty("")
    setMaxQty("")
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      minQuantity: undefined,
      maxQuantity: undefined,
      page: 1,
    })
    fetchProducts()
  }

  return (
    <>
    <Card>
      <CardHeader className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle>Products</CardTitle>
        </div>
        <Button onClick={() => openDialog("add")} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name or SKU..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
          <Separator orientation="vertical" className="h-8" />
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-28"
          />
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-28"
          />
          <Input
            type="number"
            placeholder="Min qty"
            value={minQty}
            onChange={(e) => setMinQty(e.target.value)}
            className="w-24"
          />
          <Input
            type="number"
            placeholder="Max qty"
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            className="w-24"
          />
          <Button size="sm" onClick={applyFilters} disabled={loading}>
            <Filter className="mr-2 h-4 w-4" />
            Apply
          </Button>
          <Button size="sm" variant="ghost" onClick={clearFilters} disabled={loading}>
            Clear
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={(header.column.columnDef.meta as { align?: string } | undefined)?.align === "right" ? "text-right" : ""}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {columns.map((col, colIdx) => (
                      <TableCell key={col.id?.toString() ?? `col-${colIdx}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={(cell.column.columnDef.meta as { align?: string } | undefined)?.align === "right" ? "text-right" : ""}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">
                    {loading ? "Loading..." : "No products found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Page {filters.page} of {pagination.totalPages || 1} · {pagination.total} items
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page <= 1 || loading}
              onClick={() => {
                setPage(filters.page - 1)
                fetchProducts()
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page >= pagination.totalPages || loading}
              onClick={() => {
                setPage(filters.page + 1)
                fetchProducts()
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogMode === "add" && "Add Product"}
            {dialogMode === "edit" && "Edit Product"}
            {dialogMode === "view" && "Product Details"}
            {dialogMode === "delete" && "Delete Product"}
          </DialogTitle>
        </DialogHeader>

        {dialogMode === "delete" ? (
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold">{selected?.name}</span>?
          </p>
        ) : (
          <div className="space-y-3">
            {dialogMode === "view" ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {selected?.image ? (
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{selected?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selected?.description || "No description"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Price: {currency(selected?.price ?? 0)}</div>
                  <div>Qty: {selected?.quantity ?? 0}</div>
                  <div>Updated: {selected?.updatedAt ? new Date(selected.updatedAt).toLocaleDateString() : "--"}</div>
                  <div>Value: {currency((selected?.price ?? 0) * (selected?.quantity ?? 0))}</div>
                </div>
              </div>
            ) : (
              <>
                <Input
                  placeholder="Name"
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                />
                <Input
                  placeholder="Description"
                  value={formState.description}
                  onChange={(e) => setFormState((s) => ({ ...s, description: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={formState.price}
                    onChange={(e) => setFormState((s) => ({ ...s, price: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={formState.quantity}
                    onChange={(e) => setFormState((s) => ({ ...s, quantity: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Image</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, imageFile: e.target.files?.[0] ?? null }))
                    }
                  />
                  <Input
                    placeholder="Image URL (optional)"
                    value={formState.imageUrl}
                    onChange={(e) => setFormState((s) => ({ ...s, imageUrl: e.target.value }))}
                  />
                  {(formState.imageFile || formState.imageUrl) && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Preview:</span>
                      <img
                        src={
                          formState.imageFile
                            ? URL.createObjectURL(formState.imageFile)
                            : formState.imageUrl
                        }
                        alt="preview"
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          {dialogMode === "view" ? null : (
            <Button onClick={handleSubmit} disabled={loading}>
              {dialogMode === "delete" ? "Delete" : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

