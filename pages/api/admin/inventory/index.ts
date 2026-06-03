import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/apiResponse'
import { verifyToken, extractTokenFromHeader } from '@/lib/auth'
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
      const inventory = await prisma.inventory.findMany({
        include: {
          product: {
            select: { id: true, name: true, sku: true },
          },
        },
      })

      return res.status(200).json(successResponse('Inventory fetched', inventory))
    } catch (error) {
      console.error('Error fetching inventory:', error)
      return res.status(500).json(errorResponse('Internal server error'))
    }
  }

  if (req.method === 'PATCH') {
    if (!checkAdmin(req)) {
      return res.status(403).json(errorResponse('Unauthorized'))
    }

    try {
      const { id } = req.query
      const { quantityInBaseUnit } = req.body

      if (!quantityInBaseUnit) {
        return res.status(400).json(errorResponse('Quantity required'))
      }

      const inventory = await prisma.inventory.update({
        where: { id: String(id) },
        data: {
          quantityInBaseUnit: new Decimal(quantityInBaseUnit),
        },
        include: {
          product: true,
        },
      })

      return res.status(200).json(successResponse('Inventory updated', inventory))
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json(errorResponse('Inventory not found'))
      }
      console.error('Error updating inventory:', error)
      return res.status(500).json(errorResponse('Internal server error'))
    }
  }

  return res.status(405).json(errorResponse('Method not allowed'))
}
