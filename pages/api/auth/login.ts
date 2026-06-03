import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/db'
import { comparePassword, createToken } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/apiResponse'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(errorResponse('Method not allowed'))
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json(errorResponse('Email and password required'))
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.isActive) {
      return res.status(401).json(errorResponse('Invalid credentials'))
    }

    // Verify password
    const isValid = await comparePassword(password, user.password)

    if (!isValid) {
      return res.status(401).json(errorResponse('Invalid credentials'))
    }

    // Create token
    const token = createToken(user.id, user.email, user.role)

    return res.status(200).json(
      successResponse('Login successful', {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
    )
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json(errorResponse('Internal server error'))
  }
}
