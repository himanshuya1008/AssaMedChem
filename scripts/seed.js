const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users that align with the quick login credentials
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@assmedchem.com' },
    update: {
      password: await bcrypt.hash('admin123', 10),
    },
    create: {
      email: 'admin@assmedchem.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'admin',
    },
  })

  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@assmedchem.com' },
    update: {
      password: await bcrypt.hash('seller123', 10),
    },
    create: {
      email: 'seller@assmedchem.com',
      password: await bcrypt.hash('seller123', 10),
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
      imageUrl: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=300',
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
      imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=300',
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
      imageUrl: 'https://images.unsplash.com/photo-1532187640605-a35d740ef6b6?auto=format&fit=crop&q=80&w=300',
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
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300',
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
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300',
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
      update: {
        imageUrl: productInfo.imageUrl,
        description: productInfo.description,
        category: productInfo.category,
        name: productInfo.name,
      },
      create: {
        ...productInfo,
        pricing: {
          create: pricing.map((p) => ({
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
