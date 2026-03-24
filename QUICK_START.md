# 🚀 Quick Start Guide

Get your Everest Garments application running in 10 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Generate Secure Credentials

Run the setup script to generate JWT secret and hash admin password:

```bash
npm run setup
```

The script will prompt you to:
1. Generate a JWT secret (copy the output)
2. Hash your admin password (copy the hash)

## Step 3: Configure Environment Variables

1. Create `.env.local` file in the project root
2. Copy content from `.env.example`
3. Paste the JWT secret and password hash from Step 2
4. Add MongoDB and Cloudinary credentials (see below)

## Step 4: Setup MongoDB Atlas

### Create MongoDB Database

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Build a Database"** → Choose Free tier
3. Create cluster (takes ~3 minutes)
4. Click **"Connect"**
5. Select **"Drivers"** tab
6. Copy the connection string
7. Replace `<password>` with your database password
8. Update `MONGODB_URI` in `.env.local`

### Whitelist Your IP

1. In MongoDB Atlas, go to **Network Access**
2. Click **"Add IP Address"**
3. Add your current IP (or `0.0.0.0/0` for development)

## Step 5: Setup Cloudinary

### Get API Credentials

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up or log in
3. Go to **Dashboard**
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Update in `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Step 6: Create Admin User

Run the admin initialization script:

```bash
npm run init-admin
```

This will:
1. Connect to MongoDB
2. Prompt for admin username and password
3. Create admin user in database

## Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 What to Try First

### As a Customer:
1. Go to home page
2. Click "Shop" or browse a category
3. Click a product to view details
4. Add product to cart
5. Go to cart and proceed to checkout
6. Fill in your details and submit order
7. See order confirmation page

### As Admin:
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with your credentials
3. Go to Products and add a new product
4. Upload images and save
5. Go to Orders to see submitted orders
6. Update order status

## 🐛 Troubleshooting

### "MongoDB Connection Error"
- Check `MONGODB_URI` is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Confirm database user has correct password

### "Cloudinary Upload Failed"
- Verify `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- Ensure you're uploading image files

### "Admin Login Not Working"
- Run `npm run init-admin` again to recreate admin user
- Check `.env.local` has `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH`
- Verify `JWT_SECRET` is set

### "Products Not Showing"
- Check MongoDB connection
- Ensure products exist in database
- Check browser console for API errors

## 📝 Next Steps

1. **Customize Shop Name**: Edit `app/page.tsx` and `app/admin/layout.tsx`
2. **Add Products**: Go to admin panel and add your textile products
3. **Setup Custom Domain**: Follow Vercel deployment guide (see README.md)
4. **Configure Payment**: Integrate payment gateway (optional)
5. **Email Notifications**: Setup email alerts for new orders (optional)

## 🚀 Deploy to Production

When ready to go live:

1. **Push to GitHub**
2. **Deploy on Vercel** (see README.md for detailed steps)
3. **Update domain** in Vercel settings
4. **Update admin credentials** (change default password)
5. **Enable HTTPS** (automatically done by Vercel)

## 📞 Need Help?

- Check README.md for detailed documentation
- Review API endpoints in README.md
- Check console for error messages
- Verify all environment variables are set

---

You're all set! Happy selling! 🎉
