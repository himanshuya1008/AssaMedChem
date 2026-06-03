import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { parseInrInput } from '@/lib/priceUtils'
import { Decimal } from '@prisma/client/runtime/library'

function checkAdmin(req: NextApiRequest): boolean {
  const token = extractTokenFromHeader(req.headers.authorization)
  if (!token) return false
  const decoded = verifyToken(token)
  return decoded?.role === 'admin'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAdmin(req)) {
    return res.status(403).json(errorResponse('Unauthorized'))
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: String(id) },
        include: {
          pricing: { where: { isActive: true } },
          inventory: true,
        },
      })

      if (!product || !product.isActive) {
        return res.status(404).json(errorResponse('Product not found'))
      }

      const formatted = {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        sku: product.sku,
        dimensionType: product.inventory?.dimensionType || 'count',
        quantity: product.inventory ? product.inventory.quantityInBaseUnit.toString() : '0',
        pricing: product.pricing.map((p) => ({
          unit: p.unitType,
          priceInRupees: (parseFloat(p.basePriceInPaisePerUnit.toString()) / 100).toString(),
        })),
      }

      return res.status(200).json(successResponse('Product fetched', formatted))
    } catch (error: any) {
      console.error('Error fetching product:', error)
      return res.status(500).json(errorResponse('Internal server error'))
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const { name, description, category, sku, pricing, inventory } = req.body

      if (!name || !sku) {
        return res.status(400).json(errorResponse('Name and SKU required'))
      }

      // Check if SKU is used by another product
      const existing = await prisma.product.findFirst({
        where: {
          sku,
          id: { not: String(id) },
        },
      })
      if (existing) {
        return res.status(400).json(errorResponse('SKU is already used by another product'))
      }

      // Update product inside transaction
      const updatedProduct = await prisma.$transaction(async (tx) => {
        // 1. Update basic info
        const prod = await tx.product.update({
          where: { id: String(id) },
          data: {
            name,
            description,
            category,
            sku,
          },
        })

        // 2. Delete existing pricing
        await tx.productPricing.deleteMany({
          where: { productId: String(id) },
        })

        // 3. Create new pricing
        if (pricing && pricing.length > 0) {
          await tx.productPricing.createMany({
            data: pricing.map((p: any) => ({
              productId: String(id),
              unitType: p.unit,
              basePriceInPaisePerUnit: parseInrInput(p.priceInRupees),
            })),
          })
        }

        // 4. Update/Create Inventory
        if (inventory) {
          await tx.inventory.upsert({
            where: { productId: String(id) },
            update: {
              quantityInBaseUnit: new Decimal(inventory.quantity || 0),
              dimensionType: inventory.dimensionType || 'count',
            },
            create: {
              productId: String(id),
              quantityInBaseUnit: new Decimal(inventory.quantity || 0),
              dimensionType: inventory.dimensionType || 'count',
            },
          })
        }

        return prod
      })

      return res.status(200).json(successResponse('Product updated', updatedProduct))
    } catch (error: any) {
      console.error('Error updating product:', error)
      return res.status(500).json(errorResponse(error.message || 'Internal server error'))
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.product.update({
        where: { id: String(id) },
        data: { isActive: false },
      })

      return res.status(200).json(successResponse('Product deleted'))
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json(errorResponse('Product not found'))
      }
      console.error('Error deleting product:', error)
      return res.status(500).json(errorResponse('Internal server error'))
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'))
}
