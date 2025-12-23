import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/controller/product.controller";
import { upload } from "@/middlewares/upload";

const router = Router();

// Get all products with search and filter
router.get("/", getProducts);

// Get single product by ID
router.get("/:id", getProductById);

// Create new product (with optional image upload)
router.post("/", upload.single("image"), createProduct);

// Update product (with optional image upload)
router.put("/:id", upload.single("image"), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;

