# Everest Garments - Textile Catalog Ordering System

A production-ready Next.js web application for textile wholesalers to manage product catalogs and customer orders.

## 🚀 Features

### Customer Features
- Browse products by category (Women, Kids)
- Search products
- View product details with image gallery
- Add products to cart
- Submit order requests with delivery information
- Order confirmation page

### Admin Features
- Secure JWT-based authentication
- Product management (add, edit, delete)
- Multiple product image upload to Cloudinary
- Order management with status tracking
- Dashboard with business metrics

## 📋 Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: MongoDB Atlas + Mongoose
- **Image Storage**: Cloudinary
- **Authentication**: JWT
- **Form Validation**: Zod
- **State Management**: Zustand
- **Notifications**: React Hot Toast
- **Hosting**: Vercel Ready

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account
- Git

### 1. Clone or Extract Project

```bash
cd Everest_Garments
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB - Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/everest?retryWrites=true&w=majority

# Cloudinary - Get from Cloudinary Dashboard
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Secret - Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$... (bcrypt hashed password)
```

### 4. Setup MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free project and cluster
3. Add a database user
4. Get the connection string
5. Add your IP address to the whitelist
6. Update `MONGODB_URI` in `.env.local`

### 5. Setup Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret
4. Update the Cloudinary environment variables in `.env.local`

### 6. Create Admin User

First, generate a bcrypt hash for your admin password:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Then update `.env.local` with the hashed password.

### 7. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage Guide

### Customer Website

1. **Home Page**: Browse categories and featured products
2. **Product Listing**: Filter by category or search for products
3. **Product Details**: View full product information and images
4. **Cart Management**: Add/remove items and adjust quantities
5. **Checkout**: Fill delivery information and submit order
6. **Order Confirmation**: Receive order ID and confirmation details

### Admin Panel

1. **Login**: Access at `/admin` with your credentials
2. **Dashboard**: View business metrics and statistics
3. **Products**:
   - Click "Add New Product" to create products
   - Upload multiple images to Cloudinary
   - Edit or delete existing products
4. **Orders**:
   - View all customer orders
   - Update order status (pending → contacted → completed)
   - View order details and customer information

### Demo Credentials

```
Username: admin
Password: admin123
```

Change these immediately after first login!

## 🔐 Security

- Admin routes protected with JWT authentication
- Passwords hashed with bcryptjs
- Input validation using Zod
- CORS and security headers configured
- Environment variables for sensitive data
- HTTPS ready for production

## 📦 Project Structure

```
├── app/
│   ├── api/                 # API routes
│   │   ├── products/        # Product endpoints
│   │   ├── orders/          # Order endpoints
│   │   └── admin/           # Admin endpoints
│   ├── admin/              # Admin panel pages
│   ├── products/           # Customer product pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout page
│   └── page.tsx            # Home page
├── models/                 # MongoDB schemas
├── lib/                    # Utilities (auth, db, validation)
├── hooks/                  # Custom hooks (useCart, useAuth)
├── components/             # Reusable components (if added)
└── public/                 # Static assets
```

## 🚀 Deployment on Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/everest-garments.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
5. Click "Deploy"

### 3. Custom Domain (Optional)

1. Add your domain in Vercel project settings
2. Update DNS records as instructed by Vercel

## 📊 Database Schema

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  category: 'Women' | 'Kids',
  price: Number,
  description: String,
  stock: Number,
  images: [String], // Cloudinary URLs
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  customerName: String,
  phone: String,
  address: String,
  notes: String,
  items: [{
    productId: String,
    name: String,
    quantity: Number,
    price: Number
  }],
  status: 'pending' | 'contacted' | 'completed',
  createdAt: Date,
  updatedAt: Date
}
```

### Admin
```javascript
{
  _id: ObjectId,
  username: String,
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Public APIs
- `GET /api/products` - List all products (with filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/orders` - Create order

### Admin APIs (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - List products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List orders
- `PUT /api/admin/orders/[id]` - Update order status
- `POST /api/admin/upload` - Upload image to Cloudinary

## 🎨 Customization

### Change Shop Name
Update in `app/page.tsx` and `app/admin/layout.tsx`

### Modify Colors
Edit `tailwind.config.ts` (primary color is `#D4A574`)

### Add More Categories
Update category enum in:
- `models/Product.ts`
- `models/Order.ts`
- `lib/validation.ts`
- `app/products/page.tsx`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Cloudinary Upload Fails
- Verify API credentials are correct
- Check folder permissions in Cloudinary
- Ensure file size is under limits

### Admin Login Not Working
- Check password hash is correctly formatted (bcryptjs)
- Verify JWT_SECRET is set
- Check browser console for token storage

### Products Not Showing
- Verify MongoDB connection
- Check products exist in database
- Review browser network tab for API errors

## 📞 Support

For issues or questions:
1. Check `.env.local` configuration
2. Review MongoDB and Cloudinary settings
3. Check browser console for errors
4. Verify all dependencies are installed
5. Run `npm run build` to check for build errors

## 📄 License

This project is provided as-is for use with Everest Garments.

## ✅ Checklist for Going Live

- [ ] Update admin credentials
- [ ] Test all product operations
- [ ] Test order submission and confirmation
- [ ] Verify Cloudinary uploads work
- [ ] Test on mobile devices
- [ ] Set up custom domain
- [ ] Configure email notifications (optional)
- [ ] Create admin user guide
- [ ] Backup MongoDB regularly
- [ ] Monitor Vercel analytics

---

Built with ❤️ for Everest Garments
