import { Request, Response } from "express";
import prisma from "@/lib/prisma";

// GET /api/analytics/stock-summary
// Returns high-level stats for dashboard cards
export const getStockSummary = async (_req: Request, res: Response) => {
  try {
    const [productCount, quantityAgg, lowStockCount, outOfStockCount] =
      await Promise.all([
        prisma.product.count(),
        prisma.product.aggregate({
          _sum: {
            quantity: true,
            price: true, // we'll use price * quantity for inventory value below
          },
        }),
        prisma.product.count({
          where: {
            quantity: {
              gt: 0,
              lte: 5, // configurable threshold for "low stock"
            },
          },
        }),
        prisma.product.count({
          where: {
            quantity: 0,
          },
        }),
      ]);

    // Compute total inventory value: sum(price * quantity)
    const inventoryValueResult = await prisma.product.groupBy({
      by: ["id"],
      _sum: {
        quantity: true,
        price: true,
      },
    });

    const totalInventoryValue = inventoryValueResult.reduce((acc, item) => {
      const qty = item._sum.quantity ?? 0;
      const price = item._sum.price ?? 0;
      return acc + qty * price;
    }, 0);

    res.json({
      totalProducts: productCount,
      totalQuantity: quantityAgg._sum.quantity ?? 0,
      totalInventoryValue,
      lowStockCount,
      outOfStockCount,
    });
  } catch (error: any) {
    console.error("Error fetching stock summary:", error);
    res.status(500).json({
      error: "Failed to fetch stock summary",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// GET /api/analytics/stock-by-product
// Returns data suited for charts (e.g., bar chart of stock levels per product)
export const getStockByProduct = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        quantity: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        quantity: "desc",
      },
    });

    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
      inventoryValue: p.price * p.quantity,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    res.json({ items: data });
  } catch (error: any) {
    console.error("Error fetching stock by product analytics:", error);
    res.status(500).json({
      error: "Failed to fetch stock analytics",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


