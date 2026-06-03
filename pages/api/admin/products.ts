import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { parseInrInput } from '@/lib/priceUtils'
import { convertToBaseUnit, availableUnits, getDimensionType } from '@/lib/unitConversion'
import { Decimal } from '@prisma/client/runtime/library'

function checkAdmin(req: NextApiRequest): boolean {
  const token = extractTokenFromHeader(req.headers.authorization)
  if (!token) return false
  const decoded = verifyToken(token)
  return decoded?.role === 'admin'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        include: {
          pricing: true,
          inventory: true,
        },
      })

      return res.status(200).json(successResponse('Products fetched', products))
    } catch (error) {
      console.error('Error fetching products:', error)
      return res.status(500).json(errorResponse('Internal server error'))
    }
  }

  if (req.method === 'POST') {
    if (!checkAdmin(req)) {
      return res.status(403).json(errorResponse('Unauthorized'))
    }

    try {
      const { name, description, category, sku, pricing, inventory, imageUrl } = req.body

      if (!name || !sku) {
        return res.status(400).json(errorResponse('Name and SKU required'))
      }

      // Check if SKU exists
      const existing = await prisma.product.findUnique({ where: { sku } })
      if (existing) {
        return res.status(400).json(errorResponse('SKU already exists'))
      }

      // Create product with pricing and inventory
      const product = await prisma.product.create({
        data: {
          name,
          description,
          category,
          sku,
          imageUrl,
          pricing: {
            create: (pricing || []).map((p: any) => ({
              unitType: p.unit,
              basePriceInPaisePerUnit: parseInrInput(p.priceInRupees),
            })),
          },
          inventory: inventory
            ? {
                create: {
                  quantityInBaseUnit: new Decimal(inventory.quantity || 0),
                  dimensionType: inventory.dimensionType || 'count',
                },
              }
            : undefined,
        },
        include: {
          pricing: true,
          inventory: true,
        },
      })

      return res.status(201).json(successResponse('Product created', product))
    } catch (error: any) {
      console.error('Error creating product:', error)
      return res.status(500).json(errorResponse(error.message || 'Internal server error'))
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'))
}
