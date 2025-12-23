import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

// Helper function to get or create system user for products without auth
const getSystemUserId = async (): Promise<string> => {
  const systemUser = await prisma.user.findFirst({
    where: { email: "system@stocktracker.com" },
  });

  if (systemUser) {
    return systemUser.id;
  }

  // Create system user if it doesn't exist
  const newSystemUser = await prisma.user.create({
    data: {
      email: "system@stocktracker.com",
      username: "system",
      name: "System User",
      googleId: "system-user",
    },
  });

  return newSystemUser.id;
};

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (url: string): string | null => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch {
    return null;
  }
};

// Get all products with search and filter
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    // Build where clause (no userId filter - show all products)
    const where: any = {};

    // Search by name or description
    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    // Filter by quantity range
    if (minQuantity || maxQuantity) {
      where.quantity = {};
      if (minQuantity) where.quantity.gte = parseInt(minQuantity as string);
      if (maxQuantity) where.quantity.lte = parseInt(maxQuantity as string);
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Valid sort fields
    const validSortFields = ["name", "price", "quantity", "createdAt", "updatedAt"];
    const sortField = validSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";
    const order = sortOrder === "asc" ? "asc" : "desc";

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          [sortField]: order,
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      error: "Failed to fetch product",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, image } = req.body;

    // Get system user ID for products created without auth
    const userId = await getSystemUserId();

    // Validate required fields
    if (!name || price === undefined) {
      return res.status(400).json({
        error: "Name and price are required",
      });
    }

    // Validate and parse price
    const priceNum = typeof price === "string" ? parseFloat(price) : price;
    if (typeof priceNum !== "number" || isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        error: "Price must be a non-negative number",
      });
    }

    // Validate quantity
    const qty = quantity !== undefined 
      ? (typeof quantity === "string" ? parseInt(quantity) : quantity)
      : 0;
    if (typeof qty !== "number" || isNaN(qty) || qty < 0) {
      return res.status(400).json({
        error: "Quantity must be a non-negative integer",
      });
    }

    // Handle image upload if file is present
    let imageUrl = image; // If image URL is provided directly
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "stock-tracker/products",
          resource_type: "image",
        });
        imageUrl = result.secure_url;

        // Delete local file after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError: any) {
        console.error("Cloudinary upload error:", uploadError);
        // Delete local file if upload fails
        if (req.file?.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          error: "Failed to upload image",
          details:
            process.env.NODE_ENV === "development"
              ? uploadError.message
              : undefined,
        });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: priceNum,
        quantity: qty,
        image: imageUrl || null,
        userId,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error("Error creating product:", error);
    res.status(500).json({
      error: "Failed to create product",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, image } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      const priceNum = typeof price === "string" ? parseFloat(price) : price;
      if (typeof priceNum !== "number" || isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          error: "Price must be a non-negative number",
        });
      }
      updateData.price = priceNum;
    }
    if (quantity !== undefined) {
      const qty = typeof quantity === "string" ? parseInt(quantity) : quantity;
      if (typeof qty !== "number" || isNaN(qty) || qty < 0) {
        return res.status(400).json({
          error: "Quantity must be a non-negative integer",
        });
      }
      updateData.quantity = qty;
    }

    // Handle image upload if file is present
    let imageUrl = image; // If image URL is provided directly
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (existingProduct.image) {
          const publicId = extractPublicId(existingProduct.image);
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.warn("Failed to delete old image from Cloudinary:", deleteError);
            }
          }
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "stock-tracker/products",
          resource_type: "image",
        });
        imageUrl = result.secure_url;

        // Delete local file after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError: any) {
        console.error("Cloudinary upload error:", uploadError);
        // Delete local file if upload fails
        if (req.file?.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          error: "Failed to upload image",
          details:
            process.env.NODE_ENV === "development"
              ? uploadError.message
              : undefined,
        });
      }
    }

    if (imageUrl !== undefined) {
      updateData.image = imageUrl;
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json(product);
  } catch (error: any) {
    console.error("Error updating product:", error);
    res.status(500).json({
      error: "Failed to update product",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete image from Cloudinary if exists
    if (product.image) {
      const publicId = extractPublicId(product.image);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (deleteError) {
          console.warn("Failed to delete image from Cloudinary:", deleteError);
        }
      }
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      error: "Failed to delete product",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
