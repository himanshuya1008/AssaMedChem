# ⚡ Quick Start Guide

Get AasaMedChem up and running in minutes!

## 🎯 5-Minute Setup

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL or use Neon ([Free](https://neon.tech/))
- Git

### 1️⃣ Clone & Install

```bash
git clone https://github.com/yourusername/assmedchem.git
cd assmedchem
npm install
```

### 2️⃣ Setup Database

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your PostgreSQL connection string
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/assmedchem"

# Run migrations
npm run db:push

# Seed test data
npm run db:seed
```

### 3️⃣ Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4️⃣ Login

Use these test credentials:

**Admin Account:**
- Email: `admin@assmedchem.com`
- Password: `admin123`

**Seller Account:**
- Email: `seller@assmedchem.com`
- Password: `seller123`

## 🗂️ Project Structure

```
📦 assmedchem
├── 📁 components/      - Reusable UI components
├── 📁 pages/           - Next.js pages & API routes
├── 📁 lib/             - Utilities & helpers
├── 📁 prisma/          - Database schema
├── 📁 styles/          - Global CSS
└── 📁 public/          - Static files
```

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Sync schema with database
npm run db:migrate       # Create new migration
npm run db:seed          # Populate with test data

# Code Quality
npm run lint             # Check code style
```

## 🗄️ Database Schema

Key tables:
- **User** - User accounts (Admin/Seller)
- **Product** - Chemical products
- **Inventory** - Stock levels
- **Order** - Customer orders
- **OrderItem** - Order line items

See `prisma/schema.prisma` for details.

## 🔐 Authentication

- **JWT Tokens** - Stored in localStorage
- **NextAuth.js** - Built-in authentication
- **Bcryptjs** - Password hashing
- **Roles** - Admin & Seller

## 📱 Key Features

✅ **Dashboard** - Admin overview with stats
✅ **Inventory** - Product & stock management
✅ **Orders** - Create and manage orders
✅ **API** - RESTful backend API
✅ **UI Components** - Reusable React components

## 🚀 Deploy in Minutes

### Vercel (Recommended)

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps.

### Render

1. Connect GitHub repo
2. Set build commands
3. Add environment variables
4. Deploy!

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS
- **Custom Components** - Pre-built React components
- **Dark Mode Ready** - Easy to implement

## 📚 Tech Stack

```
Frontend:  React 18 + Next.js 14 + TypeScript + Tailwind
Backend:   Node.js + Next.js API Routes
Database:  PostgreSQL + Prisma ORM
Auth:      JWT + NextAuth.js
Icons:     Heroicons + React Icons
```

## 🔑 Environment Variables

```env
# Required
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=min-32-chars
JWT_SECRET=min-32-chars

# Optional
NODE_ENV=development
API_TIMEOUT=30000
```

## 🆘 Troubleshooting

### Database connection fails?
- Check `DATABASE_URL` format
- Ensure PostgreSQL is running
- Verify credentials

### Port 3000 already in use?
```bash
npm run dev -- -p 3001
```

### Build errors?
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database issues?
```bash
# Reset database
npm run db:push --force-reset
npm run db:seed
```

## 📖 Next Steps

1. **Explore the code** - Check out component architecture
2. **Customize theme** - Update Tailwind config
3. **Add features** - Extend the API & components
4. **Deploy** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
5. **Go live** - Share with users!

## 🎓 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 💡 Pro Tips

- Use `npm run db:push` after schema changes
- Check browser console for errors (F12)
- Use VS Code for best development experience
- Enable Tailwind CSS extension in VS Code
- Keep environment variables secure

## 🤝 Need Help?

- Check [README.md](README.md) for full documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Open an issue on GitHub
- Contact support

## 🎉 You're All Set!

Your AasaMedChem instance is ready to use. Start building amazing features!

Happy coding! 🚀

---

**Need more details?** Check the [README.md](README.md) or [DEPLOYMENT.md](DEPLOYMENT.md).
