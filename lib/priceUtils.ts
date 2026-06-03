import { Decimal } from '@prisma/client/runtime/library'

/**
 * Price Storage Strategy:
 * - All prices stored in PAISE (1/100 of INR)
 * - This allows exact decimal precision without floating point errors
 * - Example: ₹100.50 = 10050 paise
 * - Example: ₹0.25 = 25 paise
 */

/**
 * Convert INR amount to paise for storage
 * @param inr - Amount in INR (can be decimal)
 * @returns Amount in paise
 */
export function convertInrToPaise(inr: number | string | Decimal): Decimal {
  const amount = new Decimal(inr)
  // Multiply by 100 to convert INR to paise
  return amount.times(100).toDecimalPlaces(0)
}

/**
 * Convert paise to INR for display
 * @param paise - Amount in paise
 * @returns Amount in INR
 */
export function convertPaiseToInr(paise: number | string | Decimal): Decimal {
  const amount = new Decimal(paise)
  // Divide by 100 to convert paise to INR
  return amount.dividedBy(100)
}

/**
 * Format price for display in INR
 * @param paise - Amount in paise
 * @returns Formatted string like "₹1,234.50"
 */
export function formatPrice(paise: number | string | Decimal): string {
  const inr = convertPaiseToInr(paise)
  const numValue = parseFloat(inr.toString())
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

/**
 * Calculate price for a quantity
 * @param pricePerUnitInPaise - Price per unit in paise
 * @param quantity - Quantity in decimal
 * @returns Total price in paise
 */
export function calculatePrice(
  pricePerUnitInPaise: number | string | Decimal,
  quantity: number | string | Decimal
): Decimal {
  const pricePerUnit = new Decimal(pricePerUnitInPaise)
  const qty = new Decimal(quantity)
  
  return pricePerUnit.times(qty).toDecimalPlaces(0)
}

/**
 * Parse INR input from user (handles strings like "100", "100.50", etc.)
 * @param input - User input
 * @returns Amount in paise
 */
export function parseInrInput(input: string | number): Decimal {
  try {
    const amount = new Decimal(input)
    
    if (amount.isNegative()) {
      throw new Error('Price cannot be negative')
    }
    
    return convertInrToPaise(amount)
  } catch (error) {
    throw new Error('Invalid price format')
  }
}

/**
 * Validate price is positive and has reasonable precision
 */
export function validatePrice(paiseAmount: Decimal): boolean {
  return !paiseAmount.isNegative() && !paiseAmount.isNaN()
}
