import { Decimal } from '@prisma/client/runtime/library'

/**
 * Unit Conversion Strategy Documentation
 * =====================================
 * 
 * Internal Storage Units:
 * - Weight: All weights stored in GRAMS (g)
 *   - 1 kg = 1000 g
 * - Volume: All volumes stored in MILLILITERS (mL)
 *   - 1 L = 1000 mL
 * - Count: All counts stored in ITEMS
 * 
 * Conversion Strategy:
 * - User input -> Convert to base unit -> Store
 * - Retrieve -> Convert from base unit -> Display/Calculate
 */

export type Unit = 'g' | 'kg' | 'mL' | 'L' | 'item'
export type DimensionType = 'weight' | 'volume' | 'count'

// Define conversion factors from each unit to base unit
const conversionFactors: Record<Unit, { toBase: number; dimensionType: DimensionType }> = {
  // Weight units (base: grams)
  'g': { toBase: 1, dimensionType: 'weight' },
  'kg': { toBase: 1000, dimensionType: 'weight' },
  
  // Volume units (base: milliliters)
  'mL': { toBase: 1, dimensionType: 'volume' },
  'L': { toBase: 1000, dimensionType: 'volume' },
  
  // Count units (base: items)
  'item': { toBase: 1, dimensionType: 'count' },
}

/**
 * Convert a quantity from a user-specified unit to base unit for storage
 * @param quantity - The quantity in the specified unit
 * @param unit - The unit of the quantity
 * @returns Quantity in base unit
 */
export function convertToBaseUnit(quantity: number | Decimal, unit: Unit): Decimal {
  const qty = new Decimal(quantity)
  const factor = conversionFactors[unit]
  
  if (!factor) {
    throw new Error(`Unknown unit: ${unit}`)
  }
  
  return qty.times(factor.toBase)
}

/**
 * Convert a quantity from base unit to a user-specified unit for display
 * @param quantityInBase - The quantity in base unit
 * @param unit - The target unit
 * @returns Quantity in the target unit
 */
export function convertFromBaseUnit(quantityInBase: number | Decimal, unit: Unit): Decimal {
  const qty = new Decimal(quantityInBase)
  const factor = conversionFactors[unit]
  
  if (!factor) {
    throw new Error(`Unknown unit: ${unit}`)
  }
  
  return qty.dividedBy(factor.toBase)
}

/**
 * Get the dimension type for a unit
 */
export function getDimensionType(unit: Unit): DimensionType {
  return conversionFactors[unit]?.dimensionType || 'count'
}

/**
 * Get all available units
 */
export const availableUnits: Unit[] = ['g', 'kg', 'mL', 'L', 'item']

/**
 * Get units for a specific dimension
 */
export function getUnitsForDimension(dimensionType: DimensionType): Unit[] {
  return availableUnits.filter(unit => conversionFactors[unit].dimensionType === dimensionType)
}

/**
 * Get conversion factor between two units (within same dimension)
 * @returns The factor to multiply the source unit by to get target unit
 */
export function getConversionFactor(fromUnit: Unit, toUnit: Unit): number {
  const fromFactor = conversionFactors[fromUnit]
  const toFactor = conversionFactors[toUnit]
  
  if (!fromFactor || !toFactor) {
    throw new Error(`Unknown unit: ${!fromFactor ? fromUnit : toUnit}`)
  }
  
  if (fromFactor.dimensionType !== toFactor.dimensionType) {
    throw new Error(`Cannot convert between ${fromUnit} and ${toUnit} (different dimensions)`)
  }
  
  return fromFactor.toBase / toFactor.toBase
}

/**
 * Format quantity for display with appropriate precision
 */
export function formatQuantity(quantity: number | Decimal, unit: Unit): string {
  const qty = new Decimal(quantity)
  
  // For weights less than 1000g, show with 2 decimals
  // For volumes less than 1000mL, show with 2 decimals
  // For items, show with 0 decimals (unless fractional)
  if (unit === 'item') {
    return qty.toFixed(qty.modulo(1).equals(0) ? 0 : 2)
  }
  
  return qty.toFixed(2)
}
