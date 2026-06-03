import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/apiResponse'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'))
  }

  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json(errorResponse('Name, email, and password required'))
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json(errorResponse('User already exists'))
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'seller',
      },
    })

    return res.status(201).json(
      successResponse('Registration successful', {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    )
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json(errorResponse('Internal server error'))
  }
}
