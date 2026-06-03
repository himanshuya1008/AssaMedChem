import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const SALT_ROUNDS = 10

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(SALT_ROUNDS)
  return bcryptjs.hash(password, salt)
}

/**
 * Compare a plain password with a hashed password
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword)
}

/**
 * Create a JWT token for a user
 */
export function createToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as { userId: string; email: string; role: string }
  } catch (error) {
    return null
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) return null
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1]
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRole: string | string[]): boolean {
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
  return roles.includes(userRole)
}
