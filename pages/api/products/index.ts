import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import { convertPaiseToInr, formatPrice } from '@/lib/priceUtils'
import { convertFromBaseUnit } from '@/lib/unitConversion'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json(errorResponse('Method not allowed'))
  }

  try {
    const { search, category } = req.query

    let where: any = { isActive: true }

    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { sku: { contains: String(search), mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = String(category)
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        pricing: { where: { isActive: true } },
        inventory: true,
      },
    })

    // Format response
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      sku: product.sku,
      pricing: product.pricing.map((p) => ({
        id: p.id,
        unit: p.unitType,
        priceInRupees: convertPaiseToInr(p.basePriceInPaisePerUnit).toFixed(2),
        priceFormatted: formatPrice(p.basePriceInPaisePerUnit),
      })),
      inventory: product.inventory
        ? {
            id: product.inventory.id,
            dimensionType: product.inventory.dimensionType,
            quantityInBaseUnit: product.inventory.quantityInBaseUnit.toString(),
          }
        : null,
    }))

    return res.status(200).json(successResponse('Products fetched', formattedProducts))
  } catch (error) {
    console.error('Get products error:', error)
    return res.status(500).json(errorResponse('Internal server error'))
  }
}
