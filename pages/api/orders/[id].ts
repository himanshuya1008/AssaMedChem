import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
import { convertToBaseUnit } from '@/lib/unitConversion'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = extractTokenFromHeader(req.headers.authorization)
  if (!token) {
    return res.status(401).json(errorResponse('Unauthorized'))
  }

  const decoded = verifyToken(token)
  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json(errorResponse('Forbidden'))
  }

  const { id } = req.query

  if (req.method === 'PATCH') {
    try {
      const { status } = req.body

      if (!status) {
        return res.status(400).json(errorResponse('Status required'))
      }

      const order = await prisma.$transaction(async (tx) => {
        // 1. Get the current order
        const currentOrder = await tx.order.findUnique({
          where: { id: String(id) },
          include: {
            items: {
              include: {
                product: {
                  include: { inventory: true },
                },
              },
            },
          },
        })

        if (!currentOrder) {
          throw new Error('ORDER_NOT_FOUND')
        }

        const isApproving = status === 'approved'
        const wasAlreadyApproved = ['approved', 'shipped', 'delivered'].includes(currentOrder.status)
        const isReverting = ['rejected', 'cancelled', 'draft'].includes(status) && wasAlreadyApproved

        // Deduct inventory when approved
        if (isApproving && !wasAlreadyApproved) {
          for (const item of currentOrder.items) {
            const inventory = item.product.inventory
            if (!inventory) {
              throw new Error(`Inventory not found for product: ${item.product.name}`)
            }

            const qtyInBaseUnit = convertToBaseUnit(item.quantityRequested, item.unitRequested as any)
            if (inventory.quantityInBaseUnit.lessThan(qtyInBaseUnit)) {
              throw new Error(`Insufficient stock for product "${item.product.name}". Available: ${inventory.quantityInBaseUnit.toString()}, Required: ${qtyInBaseUnit.toString()}`)
            }

            const newQty = inventory.quantityInBaseUnit.minus(qtyInBaseUnit)

            await tx.inventory.update({
              where: { productId: item.productId },
              data: { quantityInBaseUnit: newQty },
            })
          }
        } 
        // Revert inventory when changing from approved to rejected/cancelled
        else if (isReverting) {
          for (const item of currentOrder.items) {
            const inventory = item.product.inventory
            if (!inventory) continue

            const qtyInBaseUnit = convertToBaseUnit(item.quantityRequested, item.unitRequested as any)
            const newQty = inventory.quantityInBaseUnit.plus(qtyInBaseUnit)

            await tx.inventory.update({
              where: { productId: item.productId },
              data: { quantityInBaseUnit: newQty },
            })
          }
        }

        // 2. Update order status
        return await tx.order.update({
          where: { id: String(id) },
          data: { status },
          include: {
            items: {
              include: { product: true },
            },
          },
        })
      })

      return res.status(200).json(successResponse('Order updated successfully', order))
    } catch (error: any) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return res.status(404).json(errorResponse('Order not found'))
      }
      if (error.message && error.message.includes('Insufficient stock')) {
        return res.status(400).json(errorResponse(error.message))
      }
      console.error('Error updating order:', error)
      return res.status(500).json(errorResponse(error.message || 'Internal server error'))
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'))
}
