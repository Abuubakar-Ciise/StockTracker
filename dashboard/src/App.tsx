import { Navigate, Route, Routes } from "react-router-dom"

import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ProductLayout } from "@/components/layouts/ProductLayout"
import DashboardPage from "@/pages/DashboardPage"
import ProductsPage from "@/pages/ProductsPage"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route element={<ProductLayout />}>
        <Route path="/products" element={<ProductsPage />} />
      </Route>
    </Routes>
  )
}
