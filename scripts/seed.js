const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Admin User',
      role: 'admin',
    },
  })

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@test.com' },
    update: {},
    create: {
      email: 'seller@test.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Seller User',
      role: 'seller',
    },
  })

  console.log('✓ Users created')

  // Create sample products
  const products = [
    {
      name: 'Sulfuric Acid',
      description: 'Industrial grade sulfuric acid - 98% pure',
      category: 'Acids',
      sku: 'SA-001',
      pricing: [
        { unit: 'L', price: 5000 }, // ₹50.00 per liter
        { unit: 'mL', price: 5 }, // ₹0.05 per milliliter
      ],
      inventory: { quantity: 1000, dimensionType: 'volume' },
    },
    {
      name: 'Sodium Hydroxide',
      description: 'Caustic soda pellets - analytical grade',
      category: 'Bases',
      sku: 'NaOH-001',
      pricing: [
        { unit: 'kg', price: 30000 }, // ₹300 per kg
        { unit: 'g', price: 30 }, // ₹0.30 per gram
      ],
      inventory: { quantity: 500000, dimensionType: 'weight' },
    },
    {
      name: 'Hydrochloric Acid',
      description: 'Laboratory grade HCl - 37% aqueous solution',
      category: 'Acids',
      sku: 'HCl-001',
      pricing: [
        { unit: 'L', price: 3500 }, // ₹35 per liter
        { unit: 'mL', price: 3.5 }, // ₹0.035 per milliliter
      ],
      inventory: { quantity: 5000, dimensionType: 'volume' },
    },
    {
      name: 'Acetone',
      description: 'Laboratory grade acetone - 99.9% pure',
      category: 'Solvents',
      sku: 'ACE-001',
      pricing: [
        { unit: 'L', price: 2000 }, // ₹20 per liter
        { unit: 'mL', price: 2 }, // ₹0.02 per milliliter
      ],
      inventory: { quantity: 10000, dimensionType: 'volume' },
    },
    {
      name: 'Sodium Chloride',
      description: 'Food grade salt crystals',
      category: 'Salts',
      sku: 'NaCl-001',
      pricing: [
        { unit: 'kg', price: 5000 }, // ₹50 per kg
        { unit: 'g', price: 5 }, // ₹0.05 per gram
      ],
      inventory: { quantity: 100000, dimensionType: 'weight' },
    },
  ]

  for (const productData of products) {
    const { pricing, inventory, ...productInfo } = productData

    const product = await prisma.product.upsert({
      where: { sku: productInfo.sku },
      update: {},
      create: {
        ...productInfo,
        pricing: {
          create: pricing.map((p: any) => ({
            unitType: p.unit,
            basePriceInPaisePerUnit: Math.round(p.price),
          })),
        },
        inventory: {
          create: {
            quantityInBaseUnit: inventory.quantity,
            dimensionType: inventory.dimensionType,
          },
        },
      },
    })

    console.log(`✓ Product created: ${product.name}`)
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
