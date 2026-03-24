# ✅ Pre-Launch Checklist - Everest Garments

Complete checklist to prepare the application for launch.

---

## Phase 1: Project Setup ✅

- [x] Next.js 16.1.0 project created
- [x] TypeScript configured
- [x] TailwindCSS installed and configured
- [x] Database models created (Product, Order, Admin)
- [x] API routes implemented (13 endpoints)
- [x] Frontend pages created (11 pages)
- [x] State management with Zustand configured
- [x] Dependencies installed (`npm install`)
- [x] Build verified (`npm run build` successful)

---

## Phase 2: Environment Configuration ⏳ DO THIS FIRST

### Required Environment Variables

**Copy `.env.example` to `.env.local`:**
```bash
cp .env.example .env.local
```

**Fill in the actual values:**

#### Database Configuration
- [ ] `MONGODB_URI`: Your MongoDB Atlas connection string
  - Get from MongoDB Atlas → Clusters → Connect → Connection String
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/everest-garments?retryWrites=true&w=majority`
  - Replace `username`, `password`, and `cluster`

#### Cloudinary Configuration
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
  - Get from Cloudinary dashboard
  - Under Account → Dashboard → Cloud name
- [ ] `CLOUDINARY_API_KEY`: Your Cloudinary API key
  - Settings → API Keys
- [ ] `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
  - Settings → API Keys
  - Keep this secret! Never commit to version control

#### JWT Configuration
- [ ] `JWT_SECRET`: Generate a secure random string
  - Run: `npm run setup`
  - Or generate manually: `openssl rand -base64 32`
  - This is used to sign JWT tokens

#### Admin Credentials
- [ ] `ADMIN_PASSWORD_HASH`: Bcrypt hash of admin password
  - Run: `npm run setup`
  - Or generate manually with Node.js

### Steps to Configure

**1. Generate JWT Secret and Password Hash:**
```bash
npm run setup
```

You'll see output like:
```
✅ JWT_SECRET=your_generated_secret_here

Choose your admin password:
(input your password)

✅ ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
```

**2. Edit `.env.local`:**
```
# Database
MONGODB_URI=mongodb+srv://...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=<paste from setup script>

# Admin
ADMIN_PASSWORD_HASH=<paste from setup script>
```

**3. Verify Configuration:**
- [ ] `.env.local` file has all 6 variables filled
- [ ] `.env.local` is in `.gitignore` (so it's not committed)
- [ ] All values have no extra quotes or spaces

**⚠️ CRITICAL: Never commit `.env.local` to version control!**

---

## Phase 3: Database Setup ⏳ DO THIS SECOND

### MongoDB Atlas Setup

**1. Create MongoDB Account:**
- [ ] Sign up at https://www.mongodb.com/cloud/atlas
- [ ] Verify email
- [ ] Create free cluster

**2. Configure Cluster:**
- [ ] Create cluster (free tier M0)
- [ ] Wait for cluster to deploy (5-10 minutes)
- [ ] Create database user:
  - [ ] Username: `tetile_admin` (or your choice)
  - [ ] Password: Strong password, save it
  - [ ] Permissions: Read and write to any database
- [ ] Add IP whitelist:
  - [ ] Add your machine IP (find at https://www.whatismyipaddress.com)
  - [ ] Or add 0.0.0.0/0 for development (less secure)
  - [ ] Or use MongoDB Atlas provided connection from any network

**3. Get Connection String:**
- [ ] Clusters → your cluster → Connect button
- [ ] Choose "Connect your application"
- [ ] Copy connection string
- [ ] Format: `mongodb+srv://user:pass@cluster.mongodb.net/everest-garments`

**4. Create Database & Collections:**
- [ ] MongoDB will auto-create collections when first document inserted
- [ ] Or manually create:
  - [ ] Database name: `everest-garments`
  - [ ] Collections: `products`, `orders`, `admins` (optional, auto-created)

**5. Test Connection:**
```bash
npm run dev
```
Check browser console. If MongoDB error appears, verify URI in `.env.local`

---

## Phase 4: Cloudinary Setup ⏳ DO THIS THIRD

### Cloudinary Account Setup

**1. Create Account:**
- [ ] Sign up at https://cloudinary.com
- [ ] Verify email
- [ ] Create free account (5GB storage, 5GB/month bandwidth)

**2. Get Credentials:**
- [ ] Dashboard → Account details
- [ ] Copy `Cloud Name`
- [ ] Settings → API Keys
- [ ] Copy `API Key`
- [ ] Copy `API Secret` (keep secure!)

**3. Create Upload Preset (Optional):**
- [ ] Settings → Upload tab
- [ ] Add upload preset:
  - [ ] Name: `everest-garments`
  - [ ] Folder: `everest-garments/`
  - [ ] Auto-tag images with folder name
- [ ] Or use API key method (already implemented)

**4. Add to `.env.local`:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**5. Test Upload:**
- [ ] Run development server
- [ ] Go to Admin → Products → Create Product
- [ ] Try uploading an image
- [ ] Should upload to Cloudinary successfully

---

## Phase 5: Admin User Creation ⏳ DO THIS FOURTH

### Initialize First Admin User

**Run Admin Initialization Script:**
```bash
npm run init-admin
```

**Script will ask:**
1. Admin username (or use default: `admin`)
2. Skip password (will use ADMIN_PASSWORD_HASH from .env.local)

**Output:**
```
✅ Admin user created successfully
Username: admin
Connected to MongoDB successfully
```

**Save these credentials for later login**

**Verify Admin User Created:**
```bash
npm run dev
```
- [ ] Visit http://localhost:3000/admin/login
- [ ] Login with username: `admin`
- [ ] Password: The one you generated via `npm run setup`
- [ ] Should see admin dashboard

---

## Phase 6: Dependency Verification ✅

**Check all dependencies installed:**
```bash
npm list --depth=0
```

**Should show packages:**
- [x] next@16.1.0
- [x] react@19.0.0
- [x] react-dom@19.0.0
- [x] typescript@5.0.0
- [x] tailwindcss@3.4.0
- [x] mongoose@8.0.0
- [x] zod@3.22.0
- [x] zustand@4.4.0
- [x] jsonwebtoken@9.0.0
- [x] bcryptjs@2.4.3
- [x] next-cloudinary@6.0.0
- [x] react-hot-toast@2.4.0

**If missing, install:**
```bash
npm install
```

---

## Phase 7: Local Development Testing ⏳ LAUNCH HERE

### Start Development Server

**1. Start Server:**
```bash
npm run dev
```

**Expected Output:**
```
  ▲ Next.js 16.1.0
  - Local:        http://localhost:3000
  ✓ Ready in 1234ms
```

**2. Verify Pages Load:**
- [ ] http://localhost:3000 → Home page loads
- [ ] http://localhost:3000/products → Products page loads (may be empty)
- [ ] http://localhost:3000/cart → Cart page loads
- [ ] http://localhost:3000/checkout → Checkout page loads (requires cart items)
- [ ] http://localhost:3000/admin/login → Admin login loads

**3. Test Admin Functionality:**
- [ ] Login to http://localhost:3000/admin/login
- [ ] Username: `admin`
- [ ] Password: From `npm run setup`
- [ ] See admin dashboard
- [ ] Create a product
- [ ] Upload product image
- [ ] Create a test order via checkout
- [ ] View and manage order in admin

**4. Test Customer Flow:**
- [ ] Browse products on /products
- [ ] Click product → view details
- [ ] Add to cart
- [ ] View cart
- [ ] Checkout and place order
- [ ] See order confirmation

**Full Testing Guide:** See [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## Phase 8: Build Verification ✅

### Create Production Build

```bash
npm run build
```

**Expected:**
- Build completes in < 10 seconds
- No TypeScript errors
- No build errors
- Route listing shows all 21 routes

**If build fails:**
1. Check error message carefully
2. Review [TROUBLESHOOTING.md](README.md#troubleshooting) section
3. Check `.env.local` has all values
4. Clear `.next` folder: `rm -rf .next`
5. Try building again

---

## Phase 9: Production Build Testing

### Test Production Build Locally

```bash
npm run build
npm start
```

**Verify:**
- [ ] Server starts on http://localhost:3000
- [ ] All pages load correctly
- [ ] Performance is good (check DevTools)
- [ ] No console errors
- [ ] Images load properly

---

## Phase 10: Pre-Deployment Checklist

### Code Quality

- [ ] No console errors or warnings
- [ ] No TypeScript compilation errors
- [ ] No lint errors (if ESLint configured)
- [ ] All API endpoints tested
- [ ] All forms validated

### Environment Variables

- [ ] `.env.local` has all 6 required variables
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` is NOT committed to git
- [ ] All secrets are secure (not shared)

### Database

- [ ] MongoDB Atlas cluster is running
- [ ] Connection string is correct
- [ ] Database `everest-garments` exists (or will auto-create)
- [ ] Admin user is created

### Cloudinary

- [ ] Account created and verified
- [ ] API credentials are correct
- [ ] Upload folder is set up
- [ ] Image upload tested in admin

### Documentation

- [x] README.md complete
- [x] QUICK_START.md complete
- [x] DEPLOYMENT.md complete
- [x] API_DOCUMENTATION.md complete
- [x] TESTING_GUIDE.md complete
- [x] This checklist complete

---

## Phase 11: Git Setup (Optional, but recommended for Vercel)

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Everest Garments textile catalog"
```

### Create Remote Repository

1. [ ] Create GitHub account (if needed)
2. [ ] Create new repository (don't initialize with README)
3. [ ] Copy repository URL
4. [ ] Add remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/everest-garments.git
   git branch -M main
   git push -u origin main
   ```

### Verify Repository

- [ ] Contents visible on GitHub
- [ ] `.env.local` is NOT in repository
- [ ] Secret files excluded
- [ ] All source code included

---

## Phase 12: Deployment to Vercel

### Prepare for Deployment

1. [ ] Code is on GitHub
2. [ ] All tests pass locally
3. [ ] Production build succeeds

### Deploy to Vercel

**1. Create Vercel Account:**
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub account

**2. Import Project:**
- [ ] Go to Vercel dashboard
- [ ] Click "Add New..." → "Project"
- [ ] Select your GitHub repository
- [ ] Framework: Next.js (auto-detected)

**3. Configure Environment Variables:**
- [ ] Add all 6 environment variables:
  - [ ] MONGODB_URI
  - [ ] NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
  - [ ] JWT_SECRET
  - [ ] ADMIN_PASSWORD_HASH

**4. Deploy:**
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (2-5 minutes)
- [ ] Vercel provides a URL: `https://your-project.vercel.app`

**5. Test Deployment:**
- [ ] Visit provided URL
- [ ] Test all features work
- [ ] Check admin login
- [ ] Verify images load from Cloudinary

### Post-Deployment

- [ ] Application is live and accessible
- [ ] All pages load quickly
- [ ] API endpoints working
- [ ] Admin functionality working
- [ ] Images displaying correctly
- [ ] Database persisting data

---

## Phase 13: Custom Domain (Optional)

### Add Custom Domain

**1. Get Domain:**
- [ ] Purchase domain or use existing
- [ ] Recommended: google domains, godaddy, namecheap

**2. Configure in Vercel:**
- [ ] Settings → Domains
- [ ] Add domain: `yourdomain.com`
- [ ] Update DNS records (Vercel provides instructions)
- [ ] Wait for DNS propagation (up to 48 hours)

**3. Verify Custom Domain:**
- [ ] Visit https://yourdomain.com
- [ ] Should load your application
- [ ] HTTPS should work automatically

---

## Phase 14: Post-Launch Monitoring

### Monitor Deployment

- [ ] Check Vercel dashboard regularly
- [ ] Monitor error logs in Vercel
- [ ] Check MongoDB Atlas for alerts
- [ ] Monitor Cloudinary usage

### Performance Monitoring

- [ ] First Contentful Paint: < 2s
- [ ] Largest Contentful Paint: < 4s
- [ ] Cumulative Layout Shift: < 0.1
- [ ] API response times: < 1s

### Security Checks

- [ ] No secrets in logs
- [ ] HTTPS enabled
- [ ] Environment variables protected
- [ ] Password hashing verified
- [ ] JWT tokens secure

---

## Phase 15: Ongoing Maintenance

### Regular Tasks

- [ ] Weekly: Check for errors in Vercel logs
- [ ] Monthly: Review user feedback
- [ ] Monthly: Update dependencies: `npm update`
- [ ] Quarterly: Audit security: `npm audit`
- [ ] Quarterly: Backup MongoDB data

### Planned Improvements

- [ ] Add email notifications
- [ ] Implement payment gateway
- [ ] Add analytics dashboard
- [ ] Add SMS order updates
- [ ] Implement bulk import/export

---

## Verification Checklist

### All Phases Complete? ✅

- [ ] Phase 1: Project Setup
- [ ] Phase 2: Environment Configuration
- [ ] Phase 3: Database Setup
- [ ] Phase 4: Cloudinary Setup
- [ ] Phase 5: Admin Creation
- [ ] Phase 6: Dependency Verification
- [ ] Phase 7: Local Testing
- [ ] Phase 8: Build Verification
- [ ] Phase 9: Production Testing
- [ ] Phase 10: Pre-Deployment
- [ ] Phase 11: Git Setup
- [ ] Phase 12: Vercel Deployment
- [ ] Phase 13: Custom Domain
- [ ] Phase 14: Monitoring
- [ ] Phase 15: Maintenance Plan

---

## Critical Points to Remember

### 🔐 Security
- **NEVER** commit `.env.local` to version control
- **NEVER** share API keys or passwords in code
- **ALWAYS** use HTTPS for production
- **ALWAYS** hash passwords before storing
- **ALWAYS** validate user input

### 📱 Functionality
- Admin login required for product management
- Orders created via public API
- Images stored on Cloudinary (not local server)
- Database required for all functionality
- JWT tokens expire after 7 days

### ⚡ Performance
- Images optimized via Cloudinary
- Next.js handles static generation
- API routes optimized with caching
- Database queries should use indexes
- Monitor API response times

---

## Support & Troubleshooting

**If you encounter issues:**

1. **Database Connection Error:**
   - Verify MONGODB_URI in `.env.local`
   - Check MongoDB Atlas cluster is running
   - Verify IP whitelist in MongoDB Atlas

2. **Cloudinary Upload Error:**
   - Verify API credentials
   - Check Cloudinary account active
   - Verify folder exists in Cloudinary

3. **Admin Login Not Working:**
   - Verify admin user created with `npm run init-admin`
   - Verify JWT_SECRET in `.env.local`
   - Check browser localStorage not blocking

4. **Build Errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `npm install`
   - Check Node.js version: `node --version` (need 18+)

5. **Pages Not Loading:**
   - Check browser console for errors
   - Check server logs in terminal
   - Verify `.env.local` has all variables
   - Restart development server: `npm run dev`

---

## Timeline to Launch

| Task | Time | Status |
|------|------|--------|
| Environment Config | 10 min | ⏳ |
| MongoDB Setup | 15 min | ⏳ |
| Cloudinary Setup | 10 min | ⏳ |
| Admin Creation | 5 min | ⏳ |
| Local Testing | 20 min | ⏳ |
| Git Setup | 5 min | ⏳ |
| Vercel Deploy | 10 min | ⏳ |
| Domain Setup | 24-48 hrs | ⏳ |
| **Total** | **~1.5 hours** | ⏳ |

---

## Next Steps

1. **Right Now:** Configure `.env.local` (Phase 2)
2. **Then:** Set up MongoDB (Phase 3)
3. **Then:** Set up Cloudinary (Phase 4)
4. **Then:** Create admin user (Phase 5)
5. **Then:** Test locally (Phase 7)
6. **Finally:** Deploy to Vercel (Phase 12)

---

**🎉 You're ready to launch Everest Garments!**

For detailed documentation, see:
- [README.md](README.md) - Full documentation
- [QUICK_START.md](QUICK_START.md) - 10-minute setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing checklist

---

Generated: March 16, 2024
Last Updated: March 16, 2024
