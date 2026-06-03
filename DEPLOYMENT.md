# 🚀 AasaMedChem Deployment Guide

This guide provides step-by-step instructions for deploying your AasaMedChem application to **Vercel** or **Render**.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub account with repository pushed
- [ ] PostgreSQL database service (Neon recommended)
- [ ] Generated NEXTAUTH_SECRET and JWT_SECRET (32+ characters)
- [ ] Updated all environment variables
- [ ] Tested application locally
- [ ] Changed default credentials (admin/seller test accounts)

---

## 🎯 Generate Required Secrets

Generate secure secrets using:

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char](Get-Random -Minimum 33 -Maximum 126) }) -join ''))

# Using Node.js (cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save these values safely - you'll need them during deployment.

---

## 🔵 Deployment to Vercel

Vercel is the recommended platform for Next.js applications.

### Step 1: Connect Your Repository

1. Visit [vercel.com](https://vercel.com)
2. Click **"New Project"** or sign up if needed
3. Select **"Import Git Repository"**
4. Choose your GitHub repository
5. Click **"Import"**

### Step 2: Configure Project Settings

1. **Framework**: Should auto-detect as **Next.js**
2. **Root Directory**: Leave as default (.)
3. **Environment Variables**: Click **"Add Environment Variable"**

### Step 3: Add Environment Variables

Add the following variables:

| Variable | Value | Type |
|----------|-------|------|
| `DATABASE_URL` | Your PostgreSQL connection string | Secret |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | String |
| `NEXTAUTH_SECRET` | Your generated secret | Secret |
| `JWT_SECRET` | Your generated secret | Secret |
| `NODE_ENV` | `production` | String |
| `NEXT_PUBLIC_APP_NAME` | `AasaMedChem` | String |

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (usually 2-5 minutes)
3. Your app will be live at the provided URL!

### Step 5: Run Database Migrations

After deployment:

```bash
# Connect to Vercel CLI
npm install -g vercel
vercel env pull

# Run migrations
npm run db:push
npm run db:seed
```

Or manually via Vercel Functions:
1. Go to your Vercel project settings
2. Add temporary CLI access
3. Run `npm run db:push` and `npm run db:seed`

### Vercel Deployment Tips

- ✅ Automatic deployments on GitHub push
- ✅ Preview URLs for pull requests
- ✅ Automatic HTTPS
- ✅ Global CDN included
- ✅ Analytics and monitoring
- ✅ Serverless functions included

---

## 🟡 Deployment to Render

Render is a good alternative with a free tier.

### Step 1: Create Render Account

1. Visit [render.com](https://render.com)
2. Click **"Sign Up"**
3. Connect with GitHub
4. Authorize Render access to your repositories

### Step 2: Create Web Service

1. Click **"New +"**
2. Select **"Web Service"**
3. Choose your repository
4. Click **"Connect"**

### Step 3: Configure Build Settings

| Setting | Value |
|---------|-------|
| **Name** | `assmedchem` |
| **Environment** | `Node` |
| **Region** | Select closest to users |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` or `Starter` |

### Step 4: Add Environment Variables

Click **"Environment"** and add:

```
DATABASE_URL=your_postgresql_url
NEXTAUTH_URL=https://your-service.render.com
NEXTAUTH_SECRET=your_generated_secret
JWT_SECRET=your_generated_secret
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=AasaMedChem
```

### Step 5: Create Service

1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Visit your service URL when ready

### Step 6: Database Setup

1. Go to **"Database"** section
2. Create PostgreSQL instance
3. Copy connection string to `DATABASE_URL`
4. Run migrations via SSH terminal

### Render Deployment Tips

- ⚠️ Free tier sleeps after 15 minutes of inactivity
- ✅ Automatic deployments available
- ✅ Built-in PostgreSQL database option
- ✅ Environment-based configuration
- ✅ SSL certificates included

---

## 🗄️ Database Setup for Deployment

### Using Neon (Recommended)

Neon provides PostgreSQL hosting for free.

1. Visit [neon.tech](https://neon.tech)
2. Click **"Sign Up"**
3. Create a new project
4. Copy the connection string:
   ```
   postgresql://username:password@host/database
   ```
5. Add to your deployment platform's environment variables

### Using AWS RDS

1. Visit [aws.amazon.com/rds](https://aws.amazon.com/rds/)
2. Create PostgreSQL instance
3. Configure security groups
4. Get endpoint and create connection string

### Database Migrations on Deployment

After deployment, run:

```bash
# Via local terminal (if CLI access configured)
npm run db:push

# Or manually via deploy logs
npm run db:seed
```

---

## 🔒 Security Checklist

After deployment, ensure:

- [ ] Environment variables are secured (use "Secret" type)
- [ ] Database password is strong (20+ characters)
- [ ] NEXTAUTH_SECRET is unique and long (32+ chars)
- [ ] JWT_SECRET is different from NEXTAUTH_SECRET
- [ ] Disabled default test credentials in production
- [ ] Changed default admin/seller passwords
- [ ] SSL/HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is in place
- [ ] Monitoring and logs are set up

---

## 🧪 Post-Deployment Testing

After deployment:

1. **Test Login**
   ```
   Visit: https://your-domain.com/login
   Use your credentials
   ```

2. **Check Dashboard**
   - Navigate to admin or seller dashboard
   - Verify all features work

3. **Test API Endpoints**
   ```bash
   curl -X GET https://your-domain.com/api/products
   ```

4. **Monitor Performance**
   - Check Vercel/Render analytics
   - Monitor database performance
   - Check error logs

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```

2. **Automatic Build & Deploy**
   - GitHub webhook triggers
   - Platform builds and tests
   - Automatically deploys if successful

### Manual Deployment

If needed, manually redeploy:

**Vercel:**
- Click "Deployments" → "Deploy"

**Render:**
- Click "Manual Deploy" → "Deploy Latest Commit"

---

## 🆘 Troubleshooting

### Build Fails

1. Check build logs in platform console
2. Ensure `npm run build` works locally:
   ```bash
   npm run build
   ```
3. Verify all dependencies in `package.json`

### Database Connection Issues

1. Check `DATABASE_URL` is correct
2. Verify database is running
3. Check firewall/security groups allow connections
4. Test connection string locally

### Environment Variables Not Loaded

1. Rebuild/redeploy after adding variables
2. Verify variable names exactly match
3. Check `.env.local` is in `.gitignore`
4. Don't commit sensitive data to GitHub

### Application Crashes

1. Check error logs in platform console
2. Verify all required env vars are set
3. Check database migrations ran
4. Review Next.js build output

### Slow Performance

1. Optimize database queries
2. Enable caching headers
3. Use CDN for static assets
4. Upgrade database instance
5. Check for N+1 queries

---

## 📊 Monitoring & Maintenance

### Vercel Monitoring

- Visit Vercel Dashboard for analytics
- Check Function metrics
- Review Error logs
- Monitor bandwidth usage

### Render Monitoring

- Use Render Dashboard
- Check Event logs
- Monitor resource usage
- View deployment history

### Best Practices

- Regular backups of database
- Monitor error logs daily
- Update dependencies monthly
- Test updates in staging
- Keep security patches current

---

## 🚀 Performance Optimization

### Pre-Deployment

```bash
# Build analysis
npm run build

# Test production build locally
npm start
```

### Post-Deployment

1. Enable image optimization
2. Configure caching headers
3. Use CDN for static files
4. Optimize database indexes
5. Enable compression

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs/deployment
- **Neon Docs**: https://neon.tech/docs

---

## ✅ Deployment Verification

After successful deployment, verify:

1. ✅ Application loads without errors
2. ✅ Login/Authentication works
3. ✅ All pages load correctly
4. ✅ Database operations work
5. ✅ File uploads work (if applicable)
6. ✅ API endpoints respond correctly
7. ✅ SSL certificate is valid
8. ✅ Performance is acceptable

---

<div align="center">

**Congratulations! Your application is deployed! 🎉**

For issues or questions, check the documentation or contact support.

</div>
