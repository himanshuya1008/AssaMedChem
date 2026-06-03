# 🤝 Contributing to AasaMedChem

Thank you for your interest in contributing to AasaMedChem! This document provides guidelines and instructions for contributing.

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Report issues responsibly
- Follow best practices

## 🚀 Getting Started

### Fork & Clone

```bash
# Fork on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/assmedchem.git
cd assmedchem

# Add upstream remote
git remote add upstream https://github.com/original-owner/assmedchem.git
```

### Setup Development Environment

```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to test your changes.

## 🔄 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow existing code style
- Add comments for complex logic
- Keep commits focused and atomic
- Update tests as needed

### 3. Test Your Changes

```bash
# Run linting
npm run lint

# Test the app locally
npm run dev

# Test production build
npm run build
npm start
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: Add new feature" -m "Description of changes"
```

### Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (no logic changes)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Tests
- `chore:` Build, dependencies, etc.

**Examples:**
```
feat(auth): Add two-factor authentication
fix(api): Handle null values in products endpoint
docs(readme): Update installation steps
```

### 5. Push & Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## 📝 Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style
- [ ] Tests pass (`npm run lint`)
- [ ] Documentation is updated
- [ ] Commits are clean and descriptive
- [ ] No unrelated changes

### PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Related Issues
Fixes #(issue number)

## Screenshots (if applicable)
Include before/after screenshots
```

## 🎨 Code Style

### TypeScript

```typescript
// Use meaningful names
const getUserById = async (id: string): Promise<User> => {
  // Implementation
}

// Use proper types
interface Product {
  id: string
  name: string
  price: number
  stock: number
}

// Use const for immutability
const config = { timeout: 3000 }
```

### React Components

```typescript
// Use functional components
import React from 'react'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export default function Button({
  onClick,
  children,
  variant = 'primary',
}: ButtonProps) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}
```

### Tailwind CSS

```jsx
// Use utility classes
<div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-semibold">Title</h2>
  <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
    Action
  </button>
</div>
```

## 📚 Project Structure

```
components/      - Reusable React components
pages/           - Next.js pages and API routes
lib/             - Utility functions
prisma/          - Database schema
styles/          - Global styles
public/          - Static assets
scripts/         - Utility scripts
```

## 🐛 Bug Reports

### How to Report

1. Check if bug already exists
2. Create descriptive title
3. Include reproduction steps
4. Provide expected vs actual behavior
5. Add screenshots if relevant

### Bug Report Template

```markdown
## Description
Clear description of the bug.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Version: 1.0.0

## Screenshots
If applicable.
```

## ✨ Feature Requests

### How to Request

1. Use clear, descriptive title
2. Explain use case and benefits
3. Provide examples/mockups
4. Consider alternatives

### Feature Request Template

```markdown
## Title
Concise feature title.

## Motivation
Why is this feature needed?

## Proposed Solution
How should this work?

## Alternatives
Other solutions considered.

## Additional Context
Screenshots, links, or examples.
```

## 📖 Documentation

### When to Update

- New features need documentation
- API changes need updates
- Bug fixes may need clarification

### Where to Document

- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guides
- Code comments - Complex logic
- JSDoc comments - Functions
- Inline comments - Non-obvious code

### Documentation Standards

```typescript
/**
 * Calculates the total price including tax
 * @param basePrice - The base price before tax
 * @param taxRate - Tax rate as decimal (e.g., 0.18 for 18%)
 * @returns The total price including tax
 * @example
 * const total = calculateTotalWithTax(100, 0.18) // 118
 */
const calculateTotalWithTax = (basePrice: number, taxRate: number): number => {
  return basePrice * (1 + taxRate)
}
```

## 🚀 Release Process

We follow semantic versioning: `MAJOR.MINOR.PATCH`

- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes

## 🎯 Good First Issues

Looking to contribute? Check issues labeled:
- `good-first-issue`
- `beginner-friendly`
- `help-wanted`

## 💬 Communication

- **Issues** - Bug reports and feature requests
- **Discussions** - General questions and ideas
- **Pull Requests** - Code changes
- **Email** - Security issues only

## ✅ Checklist Before Submitting

- [ ] Code is well-formatted
- [ ] Tests pass
- [ ] No console errors or warnings
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] No merge conflicts
- [ ] Branch is up to date with main
- [ ] Self-reviewed code

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

## 📞 Questions?

Feel free to:
- Open a discussion
- Comment on issues
- Reach out via email
- Join our community

---

Thank you for contributing to AasaMedChem! 🙌

