# 🚀 Deployment Guide - Everest Garments

Complete guide to deploy your textile catalog ordering system to production.

## Overview

This application is production-ready and can be deployed to:
- **Vercel** (Recommended - serverless, built for Next.js)
- AWS, Google Cloud, Azure (with Docker)
- Self-hosted (VPS/Dedicated Server)

## ✅ Pre-Deployment Checklist

- [ ] All environment variables are set
- [ ] Database is created and accessible
- [ ] Cloudinary account is configured
- [ ] Admin user is created
- [ ] Admin credentials are secure (changed from default)
- [ ] Build passes without errors: `npm run build`
- [ ] All features tested locally
- [ ] Security headers are configured
- [ ] HTTPS is enabled
- [ ] Database backups are configured

## 📦 Deployment on Vercel (Recommended)

### Step 1: Prepare Repository

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Everest Garments textile catalog system"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/yourusername/everest-garments.git

# Push to GitHub
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" (create account or log in with GitHub)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Select the repository you just pushed

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:

```
MONGODB_URI
YOUR_MONGODB_CONNECTION_STRING

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
your_cloud_name

CLOUDINARY_API_KEY
your_api_key

CLOUDINARY_API_SECRET
your_api_secret

JWT_SECRET
your_super_secret_jwt_key_here

ADMIN_USERNAME
admin

ADMIN_PASSWORD_HASH
$2b$10$your_bcrypt_hash_here
```

3. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (typically 2-5 minutes)
3. Visit your new URL (e.g., `everest-garments.vercel.app`)

### Step 5: Test Production

1. Browse products
2. Add items to cart
3. Submit a test order
4. Check admin panel
5. Verify emails/notifications (if configured)

### Step 6: Configure Custom Domain

1. In Vercel Dashboard, go to "Domains"
2. Add your custom domain (e.g., `shop.everestgarments.com`)
3. Update DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

## 🔒 Security Best Practices

### Before Going Live

1. **Change Admin Password**
   ```bash
   npm run setup
   # Generate new password hash
   # Update ADMIN_PASSWORD_HASH in Vercel
   ```

2. **Rotate JWT Secret**
   ```bash
   npm run setup
   # Generate new JWT secret
   # Update JWT_SECRET in Vercel
   ```

3. **Enable HTTPS** (automatic on Vercel)

4. **Configure MongoDB Security**
   - Use Network Access whitelist
   - Create strong database passwords
   - Enable IP whitelisting for Vercel IPs

5. **Secure Cloudinary Account**
   - Use API restrictions
   - Set folder restrictions
   - Monitor API usage

6. **Rate Limiting** (optional add-on)
   ```bash
   npm install express-rate-limit
   ```

7. **Environment Variables**
   - Never commit `.env.local`
   - Use `.env.example` for documentation
   - Rotate secrets periodically

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Vercel Dashboard → Analytics
2. Monitor:
   - Page load times
   - Server response times
   - Error rates
   - Function invocations

### Database Monitoring

1. MongoDB Atlas → Monitoring
2. Monitor:
   - Query performance
   - Storage usage
   - Connection count
   - Operation rates

### Error Tracking

Add error tracking (optional):

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
const withSentryConfig = require('@sentry/nextjs/withSentryConfig');

module.exports = withSentryConfig({
  // ...
});
```

## 🔄 Continuous Deployment

With Vercel, every git push to main automatically:
1. Triggers a new build
2. Runs tests
3. Deploys to preview URL
4. Auto-deploys to production on approval

### Preview Deployments

- Each pull request gets a unique preview URL
- Great for testing before merging

### Production Deployments

- Automatic when pushing to main
- Keep main branch stable

## 💾 Database Backups

### MongoDB Atlas Backups

1. Go to Backups in MongoDB Atlas
2. Enable "Continuous Cloud Backups"
3. Configure backup retention
4. Test backup restoration regularly

### Manual Backups

```bash
# Backup database
mongodump --uri="your_mongodb_uri" --out=./backup

# Restore from backup
mongorestore --uri="your_mongodb_uri" ./backup
```

## 📞 Troubleshooting Production Issues

### Build Fails on Vercel

1. Check build logs in Vercel Dashboard
2. Verify environment variables
3. Try clearing cache: Settings → "Redeploy"

### API Routes Not Working

1. Check function logs in Vercel
2. Verify MongoDB connection
3. Check Cloudinary credentials

### Images Not Showing

1. Verify Cloudinary URLs are HTTPS
2. Check CORS settings
3. Verify image permissions in Cloudinary

### Performance Issues

1. Check Vercel Analytics
2. Optimize images (already configured)
3. Enable Next.js Image Optimization
4. Consider CDN for static assets

## 🔐 SSL/HTTPS

- **Vercel**: Automatic with free SSL certificate
- **Custom Domain**: Auto-issued Let's Encrypt certificate
- **Renewal**: Automatic before expiration

## 📈 Scaling

As traffic grows:

1. **Database**
   - Upgrade MongoDB tier for better performance
   - Enable sharding if needed

2. **CDN**
   - Vercel includes CDN by default
   - Cache static assets

3. **Functions**
   - Vercel serverless scales automatically
   - No manual scaling needed

4. **Cloudinary**
   - Check usage limits
   - Upgrade plan if needed

## 🆘 Support & Rollback

### Rollback to Previous Version

1. Go to Deployments in Vercel Dashboard
2. Find previous successful deployment
3. Click "Redeploy"

### Emergency Downtime

If critical issues occur:

1. Immediate rollback to known good version
2. Investigate in development
3. Test fixes locally
4. Redeploy when ready

## 📅 Maintenance Schedule

### Daily
- Monitor error rates
- Check order processing

### Weekly
- Review analytics
- Check database usage
- Verify backups

### Monthly
- Review security logs
- Update dependencies
- Performance optimization

### Quarterly
- Full security audit
- Update admin credentials
- Review scaling needs

## ✨ Post-Launch

1. **Monitor Performance**
   - Set up alerting
   - Track metrics

2. **Gather Feedback**
   - Customer feedback forms
   - Usage analytics

3. **Plan Improvements**
   - Feature requests
   - Performance optimizations

4. **Marketing**
   - SEO optimization
   - Social media integration
   - Email notifications

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

Your application is now ready for production! 🎉
