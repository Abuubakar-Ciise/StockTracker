import { Router } from "express";
import {
  getStockSummary,
  getStockByProduct,
} from "@/controller/analytics.controller";

const router = Router();

// High-level stock summary for dashboard cards
router.get("/stock-summary", getStockSummary);

// Stock levels per product for charts
router.get("/stock-by-product", getStockByProduct);

export default router;


