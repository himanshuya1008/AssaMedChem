# 🧪 AasaMedChem - Professional Inventory & Order Management System

<div align="center">

**A modern, feature-rich inventory and order management system designed for pharmaceutical and chemical businesses.**

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🌟 Key Features

### 📊 **Inventory Management**
- Real-time inventory tracking
- Multi-unit support (grams, kilograms, liters, milliliters, items)
- Automatic unit conversion
- Low stock alerts
- Product categorization and SKUs
- Batch operations

### 🛒 **Order Management**
- Browse and search products
- Place orders with flexible units
- Order status tracking
- Order history
- Admin order review and approval
- Order analytics

### 👥 **Role-Based Access Control**
- Admin dashboard with full control
- Seller access to products and orders
- Secure JWT-based authentication
- User management capabilities
- Permission-based features

### 💰 **Pricing & Calculations**
- Flexible pricing per unit
- Precise decimal calculations
- Automatic total calculations
- Price history tracking
- INR currency support

### 📈 **Analytics & Reports**
- Dashboard statistics
- Sales analytics
- Inventory reports
- User activity tracking
- Export capabilities

### 🎨 **Professional UI/UX**
- Modern, responsive design
- Intuitive navigation
- Dark/Light mode support
- Accessible components
- Mobile-friendly interface
- Smooth animations and transitions

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/assmedchem.git
cd assmedchem
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/assmedchem
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars
JWT_SECRET=your-jwt-secret-min-32-chars
```

4. **Set up the database**
```bash
npm run db:push
npm run db:seed
```

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

---

## 📚 Project Structure

```
assmedchem/
├── components/          # Reusable React components
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Table.tsx
│   ├── StatCard.tsx
│   ├── Modal.tsx
│   └── Alert.tsx
├── pages/              # Next.js pages and API routes
│   ├── index.tsx       # Home page
│   ├── login.tsx       # Login page
│   ├── register.tsx    # Registration page
│   ├── admin/          # Admin dashboard
│   ├── seller/         # Seller dashboard
│   └── api/            # API endpoints
├── lib/                # Utility functions
│   ├── db.ts
│   ├── auth.ts
│   ├── apiResponse.ts
│   ├── unitConversion.ts
│   └── priceUtils.ts
├── prisma/             # Database schema
│   └── schema.prisma
├── styles/             # Global styles
│   └── globals.css
├── scripts/            # Utility scripts
│   └── seed.js
└── public/             # Static assets
```

---

## 🔐 Authentication

### Default Test Credentials

**Admin Account:**
- Email: `admin@assmedchem.com`
- Password: `admin123`

**Seller Account:**
- Email: `seller@assmedchem.com`
- Password: `seller123`

⚠️ **Change these credentials in production!**

---

## 📱 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration
npm run db:seed          # Seed database with test data

# Code Quality
npm run lint             # Run ESLint
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub** (if not already)
2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js
3. **Set environment variables**
   - Add DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, JWT_SECRET
4. **Deploy**
   - Click Deploy and wait for completion

### Deploy to Render

1. **Create Render account** at [render.com](https://render.com)
2. **Connect GitHub repository**
3. **Create new Web Service**
   - Select your repository
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Add environment variables**
   - DATABASE_URL
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET
   - JWT_SECRET
5. **Deploy**

### Environment Variables

Required for deployment:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your deployment URL
- `NEXTAUTH_SECRET` - Random string (32+ characters)
- `JWT_SECRET` - Random string (32+ characters)

---

## 🗄️ Database Setup

### Using Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a PostgreSQL database
3. Copy connection string to `DATABASE_URL`
4. Run migrations:
```bash
npm run db:push
npm run db:seed
```

### Using Local PostgreSQL

```bash
# Create database
createdb assmedchem

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/assmedchem"

# Run setup
npm run db:push
npm run db:seed
```

---

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List products
- `POST /api/admin/products` - Create product (Admin)
- `PUT /api/admin/products/[id]` - Update product (Admin)
- `DELETE /api/admin/products/[id]` - Delete product (Admin)

### Orders
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details
- `PUT /api/orders/[id]` - Update order status

### Inventory
- `GET /api/admin/inventory` - Get inventory
- `PUT /api/admin/inventory/[id]` - Update inventory

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Heroicons** - Icons

### Backend
- **Node.js** - Runtime
- **Prisma** - ORM
- **PostgreSQL** - Database
- **NextAuth** - Authentication
- **JWT** - Token management
- **bcryptjs** - Password hashing

### DevOps
- **Vercel** - Hosting
- **Render** - Alternative hosting
- **GitHub** - Version control
- **Neon** - Database hosting

---

## 📈 Performance Optimization

- Server-side rendering with Next.js
- Automatic code splitting
- Image optimization
- CSS optimization with Tailwind
- Database query optimization
- Caching strategies
- CDN distribution

---

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- SQL injection prevention with Prisma
- XSS protection
- CSRF tokens
- Secure headers
- Input validation and sanitization

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Documentation

- 📖 [Next.js Documentation](https://nextjs.org/docs)
- 🗄️ [Prisma Documentation](https://www.prisma.io/docs/)
- 🎨 [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- 🔐 [NextAuth.js Documentation](https://next-auth.js.org/)

---

## 👨‍💻 Author

**AasaMedChem Development Team**

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling utilities
- Prisma for database management
- The amazing open-source community

---

<div align="center">

Made with ❤️ by AasaMedChem

**[Website](https://assmedchem.com) • [GitHub](https://github.com/assmedchem) • [Support](https://support.assmedchem.com)**

</div>

### Database
- **PostgreSQL (Neon)** - Cloud-hosted relational database
- **Prisma** - ORM for type-safe database access

### Authentication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification

### Deployment
- **Vercel** - Next.js hosting and deployment
- **Render** - Alternative deployment option

---

## System Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│                 Tailwind CSS + React                     │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────┐
│              Next.js Application (Vercel)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │            API Routes (/api)                     │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  • /api/auth/login      (Authentication)        │   │
│  │  • /api/auth/register   (User Registration)     │   │
│  │  • /api/products/       (Product List)          │   │
│  │  • /api/admin/products  (Admin CRUD)            │   │
│  │  • /api/orders/         (Order Management)      │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Pages & Components                       │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  • pages/index.tsx       (Home Page)             │   │
│  │  • pages/admin/*         (Admin Dashboard)       │   │
│  │  • pages/seller/*        (Seller Interface)      │   │
│  │  • pages/login.tsx       (Login)                 │   │
│  │  • pages/register.tsx    (Registration)         │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                   Prisma ORM
                         │
┌────────────────────────▼────────────────────────────────┐
│          PostgreSQL Database (Neon)                     │
│                                                         │
│  Tables:                                                │
│  • users          (Accounts & Roles)                   │
│  • products       (Product Master)                     │
│  • product_pricing (Unit-based Pricing)               │
│  • inventory      (Stock Levels)                       │
│  • orders         (Order Header)                       │
│  • order_items    (Order Details)                      │
│  • quotations     (RFQ Header)                         │
│  • quotation_items (RFQ Items)                         │
└─────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Data Types & Precision

**Why these choices?**

1. **Decimal(20, 6) for Quantities**
   - Supports values up to 99,999,999,999,999 (≈100 trillion)
   - 6 decimal places for precise fractional quantities (e.g., 0.000001)
   - Suitable for all unit conversions without loss of precision

2. **Decimal(20, 0) for Prices (in Paise)**
   - Stores prices as paise (1/100 INR) to avoid floating-point errors
   - Example: ₹100.50 stored as 10050 paise
   - Maximum: ≈999 trillion paise (≈9.99 trillion INR)

3. **String for Unit Types**
   - Flexible storage of unit identifiers: "g", "kg", "L", "mL", "item"
   - Allows future unit extensions

### Tables

#### `users`
```sql
CREATE TABLE users (
  id          String    PRIMARY KEY (CUID)
  email       String    UNIQUE
  password    String    (bcrypt hashed)
  name        String
  role        String    ('admin' or 'seller')
  isActive    Boolean   DEFAULT true
  createdAt   DateTime  DEFAULT now()
  updatedAt   DateTime
)
```

#### `products`
```sql
CREATE TABLE products (
  id          String    PRIMARY KEY
  name        String    UNIQUE
  description String
  category    String    NULLABLE
  sku         String    UNIQUE
  isActive    Boolean   DEFAULT true
  createdAt   DateTime
  updatedAt   DateTime
)
```

#### `product_pricing`
```sql
CREATE TABLE product_pricing (
  id                          String      PRIMARY KEY
  productId                   String      FOREIGN KEY (products)
  unitType                    String      ('g', 'kg', 'L', 'mL', 'item')
  basePriceInPaisePerUnit     Decimal(20,0)  (e.g., 10050 = ₹100.50)
  isActive                    Boolean     DEFAULT true
  createdAt                   DateTime
  updatedAt                   DateTime
  
  UNIQUE(productId, unitType)
)
```

#### `inventory`
```sql
CREATE TABLE inventory (
  id                      String          PRIMARY KEY
  productId               String          UNIQUE FOREIGN KEY
  quantityInBaseUnit      Decimal(20,6)   (in base unit)
  dimensionType           String          ('weight', 'volume', 'count')
  lastUpdated             DateTime
)
```

#### `orders`
```sql
CREATE TABLE orders (
  id                  String          PRIMARY KEY
  userId              String          FOREIGN KEY (users)
  status              String          ('draft', 'submitted', 'approved', 'rejected', 'shipped', 'delivered')
  totalPriceInPaise   Decimal(20,0)   (in paise)
  notes               String          NULLABLE
  createdAt           DateTime
  updatedAt           DateTime
)
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id                      String          PRIMARY KEY
  orderId                 String          FOREIGN KEY (orders)
  productId               String          FOREIGN KEY (products)
  unitRequested           String          ('g', 'kg', 'L', 'mL', 'item')
  quantityRequested       Decimal(20,6)   (in requested unit)
  priceCalculatedInPaise  Decimal(20,0)   (total for this line)
  createdAt               DateTime
  updatedAt               DateTime
)
```

#### `quotations` & `quotation_items`
- Similar structure to orders and order_items
- Status: 'pending', 'quoted', 'rejected', 'expired'

---

## Unit Conversion Strategy

### Internal Storage (Base Units)

| Dimension | Base Unit | Conversion |
|-----------|-----------|------------|
| Weight | Grams (g) | 1 kg = 1000 g |
| Volume | Milliliters (mL) | 1 L = 1000 mL |
| Count | Items | 1 item = 1 unit |

### Conversion Flow

```
User Input (any unit)
         │
         ▼
    Convert to Base Unit (via unitConversion.ts)
         │
         ▼
    Store in Database (as Decimal)
         │
         ▼
    Calculate Prices (using stored quantity)
         │
         ▼
    Convert from Base Unit (for display)
         │
         ▼
    Display to User
```

### Example: Sulfuric Acid Order

1. **Admin sets price**: ₹50 per Liter
   - Stored as: 5000 paise per 1000 mL (base unit)
   - Or: 5 paise per mL

2. **Customer orders**: 500 mL
   - Input: unit="mL", quantity=500
   - No conversion needed (already in base unit)
   - Calculation: 500 × 5 paise = 2500 paise = ₹25

3. **Customer orders**: 1.5 Liters
   - Input: unit="L", quantity=1.5
   - Convert to base: 1.5 × 1000 = 1500 mL
   - Calculation: 1500 × 5 paise = 7500 paise = ₹75

---

## Pricing & Quantity Storage

### Price Storage Strategy

**All prices stored in PAISE (1/100 INR)**

| Amount | Storage | Reason |
|--------|---------|--------|
| ₹100.50 | 10050 | Avoid floating-point errors |
| ₹0.25 | 25 | Support micro-pricing |
| ₹1,234.56 | 123456 | Handle large amounts precisely |

### Quantity Storage Strategy

**Store in base units with 6 decimal places**

Examples:
- 1.5 kg → 1500.000000 g
- 250 mL → 250.000000 mL
- 0.001 kg → 1.000000 g
- 2.5 items → 2.500000 items (fractional items supported)

### Conversion Functions

```typescript
// lib/priceUtils.ts
convertInrToPaise(100.50)        // Returns: 10050
convertPaiseToInr(10050)         // Returns: 100.50
formatPrice(10050)               // Returns: "₹100.50"
calculatePrice(5, 1500)          // Returns: 7500 (paise)

// lib/unitConversion.ts
convertToBaseUnit(1.5, 'kg')     // Returns: 1500 (grams)
convertFromBaseUnit(1500, 'kg')  // Returns: 1.5 (kilograms)
getConversionFactor('kg', 'g')   // Returns: 1000
```

---

## File Structure

```
assmedchem/
├── pages/
│   ├── index.tsx                 # Home page
│   ├── login.tsx                 # Login page
│   ├── register.tsx              # Registration page
│   ├── admin/
│   │   ├── index.tsx            # Admin dashboard
│   │   ├── products/
│   │   │   ├── index.tsx        # Product list
│   │   │   ├── [id].tsx         # Edit product
│   │   │   └── new.tsx          # Create product
│   │   ├── orders/
│   │   │   └── index.tsx        # View all orders
│   │   ├── inventory/
│   │   │   └── index.tsx        # Inventory management
│   │   └── users/
│   │       └── index.tsx        # User management
│   ├── seller/
│   │   ├── index.tsx            # Product browser
│   │   ├── orders/
│   │   │   └── index.tsx        # Order history
│   │   └── checkout/
│   │       └── index.tsx        # Order checkout
│   └── api/
│       ├── auth/
│       │   ├── login.ts         # Login endpoint
│       │   └── register.ts      # Registration endpoint
│       ├── products/
│       │   └── index.ts         # Get products
│       ├── admin/
│       │   ├── products.ts      # Admin product CRUD
│       │   ├── inventory.ts     # Inventory management
│       │   └── orders.ts        # Order management
│       └── orders/
│           └── index.ts         # Order endpoints
│
├── lib/
│   ├── db.ts                    # Database connection
│   ├── auth.ts                  # Authentication utilities
│   ├── unitConversion.ts        # Unit conversion logic
│   ├── priceUtils.ts            # Price formatting & calculation
│   └── apiResponse.ts           # Standard response format
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── scripts/
│   └── seed.js                  # Database seeding
│
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .env.local
├── README.md
└── .gitignore
```

---

## Setup Instructions

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **npm or yarn** - Package manager
- **Git** - Version control
- **PostgreSQL account on Neon** - Database hosting
- **Vercel account** - For deployment

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/assmedchem.git
cd assmedchem
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Setup Database (Neon PostgreSQL)

**Create Neon Database:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Sign up or log in
3. Create a new project
4. Copy the connection string

**Update Environment Variables:**
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local and add your Neon connection string
# DATABASE_URL="postgresql://user:password@ep-xxxxx.us-east-1.neon.tech/assmedchem"
```

#### 4. Create Database Tables
```bash
# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

#### 5. Seed Test Data
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@test.com` / `password123`
- Seller user: `seller@test.com` / `password123`
- 5 sample chemical products with pricing and inventory

#### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### Testing Locally

**Test Credentials:**
```
Admin:  admin@test.com / password123
Seller: seller@test.com / password123
```

**Test Flow:**
1. Login as seller
2. Browse products
3. Create an order with multiple units
4. Verify pricing calculations
5. Login as admin
6. View orders and manage products

---

## Deployment to Vercel

### Prerequisites
- GitHub repository
- Vercel account

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit: AasaMedChem inventory system"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your GitHub repository
4. Vercel auto-detects Next.js configuration
5. Add environment variables:
   ```
   DATABASE_URL: <your-neon-connection-string>
   NEXTAUTH_URL: <your-vercel-url>
   NEXTAUTH_SECRET: <generate-random-secret>
   JWT_SECRET: <generate-random-secret>
   NODE_ENV: production
   ```
6. Click "Deploy"

**Option B: Using Vercel CLI**
```bash
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 3: Configure Database

In Vercel dashboard:
1. Go to your project settings
2. Environment variables
3. Add all variables from `.env.local`

### Step 4: Run Migrations (if needed)

```bash
vercel env pull          # Pull environment variables
npm run db:push          # Push schema to production database
```

---

## Deployment to Render

### Step 1: Create Render Account
Go to [render.com](https://render.com) and sign up

### Step 2: Create Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: assmedchem
   - **Region**: Choose closest to you
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables
In Render dashboard, add:
```
DATABASE_URL: <your-neon-connection-string>
NEXTAUTH_URL: <your-render-url>
NEXTAUTH_SECRET: <generate-random-secret>
JWT_SECRET: <generate-random-secret>
NODE_ENV: production
```

### Step 4: Deploy
Click "Create Web Service" - Render will build and deploy automatically

---

## Git Workflow & Commits

### Meaningful Commit Messages

```bash
# Feature: Add new functionality
git commit -m "feat: Add unit conversion logic with Decimal precision"

# Fix: Bug fixes
git commit -m "fix: Correct price calculation for fractional quantities"

# Docs: Documentation updates
git commit -m "docs: Update README with deployment instructions"

# Style: Code formatting
git commit -m "style: Format admin products page with Tailwind CSS"

# Refactor: Code improvements
git commit -m "refactor: Extract API response handler to utility function"

# Test: Test additions
git commit -m "test: Add unit conversion test cases"
```

### Commit History Example

```
* 5a7c2d1 - deploy: Configure Vercel deployment
* 8b3e4f2 - docs: Add comprehensive README with all documentation
* 9c4d5e3 - feat: Implement admin order management interface
* 2a6b7c4 - feat: Add seller order checkout page
* 1d8e9f5 - feat: Implement order creation API with price calculation
* 3e7f2a6 - feat: Add product management API for admin
* 4f8g3b7 - feat: Implement unit conversion with base unit strategy
* 5g9h4c8 - feat: Setup authentication with JWT tokens
* 6h0i5d9 - feat: Create Prisma schema with PostgreSQL types
* 7i1j6e0 - feat: Add API routes for products and authentication
* 8j2k7f1 - feat: Setup Next.js project with Tailwind CSS
```

---

## How to Use

### For Sellers/Users

1. **Register an Account**
   - Go to registration page
   - Create account with email and password
   - Select "Seller/User" role

2. **Browse Products**
   - Login and navigate to "Browse Products"
   - Search by product name or SKU
   - Filter by category

3. **Place an Order**
   - Select product
   - Choose unit (g, kg, L, mL, item)
   - Enter quantity
   - See calculated price automatically
   - Click "Add to Order"
   - Review order details
   - Submit order

4. **View Order History**
   - Go to "My Orders"
   - See all your orders with status
   - View order details and calculations

### For Admins

1. **Login to Admin Dashboard**
   - Use admin credentials
   - Access admin dashboard

2. **Manage Products**
   - View all products
   - Click "Add Product" to create new product
   - Set product name, SKU, category
   - Configure pricing for each unit
   - Set initial inventory

3. **Update Inventory**
   - Go to "Inventory"
   - View current stock levels
   - Update quantity for each product
   - Track inventory in base units

4. **Manage Orders**
   - Go to "Orders"
   - View all customer orders
   - Review quantities and pricing
   - Verify unit conversions are correct
   - Update order status (approve/reject/ship/deliver)

5. **Manage Users**
   - Go to "Users"
   - View all registered users
   - Manage user roles and access
   - Deactivate inactive users

---

## Features Explained

### Unit Conversion in Practice

**Scenario: Customer orders Sulfuric Acid**

Admin Setup:
- Product: Sulfuric Acid
- Price: ₹50 per Liter
- Internal storage: milliliters (mL)

Customer Order 1:
- Requests: 2 Liters
- Conversion: 2 L = 2000 mL
- Price: 2000 mL × (₹50/1000) = ₹100

Customer Order 2:
- Requests: 500 mL
- Conversion: 500 mL = 0.5 L
- Price: 500 mL × (₹50/1000) = ₹25

Customer Order 3:
- Requests: 1.5 Liters
- Conversion: 1.5 L = 1500 mL
- Price: 1500 mL × (₹50/1000) = ₹75

**The system handles all conversions automatically!**

### Precision Pricing

All prices calculated with exact precision:
- ₹100.50 stored as 10050 paise
- Calculations never lose precision
- No rounding errors accumulate
- Supports prices down to ₹0.01

---

## Troubleshooting

### Database Connection Error
```
Error: connect ENOENT /tmp/.s.PGSQL.5432

Solution:
- Check DATABASE_URL in .env.local
- Verify Neon credentials are correct
- Ensure connection string format is correct
```

### Authentication Failed
```
Error: Invalid token

Solution:
- Clear browser cache and cookies
- Regenerate JWT_SECRET in .env.local
- Restart development server
```

### Unit Conversion Issues
```
Error: Cannot convert between g and L

Solution:
- These are different dimensions
- Weight units (g, kg) and volume units (L, mL) cannot convert
- Check product's dimensionType in database
```

---

## Performance Considerations

### Database Queries
- Indexed on `productId`, `userId`, `status` for fast lookups
- Prisma caching enabled in development
- Connection pooling on Neon

### Decimal Precision
- Using Prisma `Decimal` type for all calculations
- No floating-point arithmetic
- Accurate to 6 decimal places for quantities

### Unit Conversions
- Pre-calculated conversion factors
- O(1) lookup time for conversions
- Cached in memory

---

## Future Enhancements

- [ ] Email notifications for order status updates
- [ ] Advanced reporting and analytics
- [ ] Bulk order import from CSV
- [ ] Integration with payment gateways (Razorpay, Stripe)
- [ ] Multi-currency support
- [ ] Warehouse management system
- [ ] Supplier integration
- [ ] Mobile app version

---

## Support & Contact

For issues or questions:
1. Check GitHub issues
2. Review this README
3. Contact the development team

---

## License

This project is proprietary software for AasaMedChem. All rights reserved.

---

## Quick Links

- 🌐 **Live Demo**: (To be deployed)
- 📚 **Documentation**: See sections above
- 🐛 **Report Bug**: GitHub Issues
- 💡 **Feature Request**: GitHub Discussions

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready
