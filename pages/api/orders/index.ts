import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { calculatePrice } from '@/lib/priceUtils'
import { convertToBaseUnit } from '@/lib/unitConversion'
import { Decimal } from '@prisma/client/runtime/library'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = extractTokenFromHeader(req.headers.authorization)
  if (!token) {
    return res.status(401).json(errorResponse('Unauthorized'))
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(401).json(errorResponse('Invalid token'))
  }

  if (req.method === 'GET') {
    try {
      let where: any = {}

      if (decoded.role === 'seller') {
        where.userId = decoded.userId
      }

      const orders = await prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return res.status(200).json(successResponse('Orders fetched', orders))
    } catch (error) {
      console.error('Error fetching orders:', error)
      return res.status(500).json(errorResponse('Internal server error'))
    }
  }

  if (req.method === 'POST') {
    try {
      const { items, notes, deliveryLocation } = req.body

      if (!items || items.length === 0) {
        return res.status(400).json(errorResponse('At least one item required'))
      }

      let totalPriceInPaise = new Decimal(0)

      // Validate items and calculate total
      const orderItems = await Promise.all(
        items.map(async (item: any) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            include: { pricing: true },
          })

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`)
          }

          const pricing = product.pricing.find((p) => p.unitType === item.unit)
          if (!pricing) {
            throw new Error(`Pricing not found for ${item.unit}`)
          }

          const priceCalculated = calculatePrice(
            pricing.basePriceInPaisePerUnit,
            new Decimal(item.quantity)
          )

          totalPriceInPaise = totalPriceInPaise.plus(priceCalculated)

          return {
            productId: product.id,
            unitRequested: item.unit,
            quantityRequested: new Decimal(item.quantity),
            priceCalculatedInPaise: priceCalculated,
          }
        })
      )

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: decoded.userId,
          status: 'submitted',
          totalPriceInPaise,
          notes,
          deliveryLocation: deliveryLocation || 'Main Warehouse',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return res.status(201).json(successResponse('Order created successfully', order))
    } catch (error: any) {
      console.error('Error creating order:', error)
      return res.status(500).json(errorResponse(error.message || 'Internal server error'))
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'))
}
