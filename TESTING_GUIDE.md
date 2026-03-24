# 🧪 Testing Guide - Everest Garments

Complete testing guide for the textile catalog ordering system.

## Prerequisites

Before testing, ensure:
1. Environment variables are configured in `.env.local`
2. MongoDB Atlas connection is working
3. Cloudinary credentials are set up
4. Admin user is created (`npm run init-admin`)
5. Development server is running (`npm run dev`)

---

## Manual Testing Checklist

### Phase 1: Server Startup ✅

**Step 1: Start Development Server**
```bash
npm run dev
```

**Expected Result:**
```
  ▲ Next.js 16.1.0
  - Local:        http://localhost:3000
  ✓ Ready in 1234ms
```

**What to verify:**
- [ ] No errors in terminal
- [ ] Server starts within 2 seconds
- [ ] Can navigate to http://localhost:3000

---

### Phase 2: Home Page (Public) ✅

**Visit:** http://localhost:3000

**Elements to verify:**
- [ ] Hero banner displays with shop name "Everest Garments"
- [ ] Hero image loads correctly
- [ ] Navigation bar shows: Home, Shop, Cart (0), Admin Login
- [ ] Category section shows "Women" and "Kids" cards
- [ ] Category cards are clickable and have hover effects
- [ ] Bottom section shows about information
- [ ] Footer displays copyright information
- [ ] Responsive design works on mobile view (zoom to 375px)
- [ ] No console errors (F12 → Console tab)

---

### Phase 3: Product Browsing ✅

**Visit:** http://localhost:3000/shop

**Without any products (first time):**
- [ ] Page loads successfully
- [ ] "No products found" message displays

**After creating products (see admin section):**

**Elements to verify:**
- [ ] Product grid displays with images
- [ ] Search box works:
  - [ ] Type "dress" → filters products
  - [ ] Type "xyz" → shows "No products found"
  - [ ] Clear search → shows all products again
- [ ] Category filter buttons work:
  - [ ] Click "Women" → shows only women products
  - [ ] Click "Kids" → shows only kids products
  - [ ] Click "All" → shows all products
- [ ] Products show:
  - [ ] Product image
  - [ ] Product name
  - [ ] Price formatted as "₨ 1500"
  - [ ] Stock status badge (green if in stock, gray if out of stock)
- [ ] Clicking product navigates to detail page
- [ ] Search and filter work together

---

### Phase 4: Product Details ✅

**From products page, click any product**

**Elements to verify:**
- [ ] Product images display in main view
- [ ] Thumbnail gallery shows all images
- [ ] Click thumbnails → main image updates
- [ ] Product information displays:
  - [ ] Name
  - [ ] Price
  - [ ] Description
  - [ ] Stock quantity
  - [ ] Category
- [ ] Quantity selector shows:
  - [ ] "-" button (disabled if quantity is 1)
  - [ ] Quantity input showing "1"
  - [ ] "+" button
- [ ] "Add to Cart" button is visible and clickable
- [ ] Related products section at bottom (if implemented)
- [ ] No console errors

**Test Add to Cart:**
- [ ] Click "Add to Cart" button
- [ ] Toast notification appears: "Added to cart"
- [ ] Cart count in navbar updates (should show 1)
- [ ] Click again with quantity 2 → toast shows "Updated quantity"
- [ ] Add another product → cart count updates

---

### Phase 5: Shopping Cart ✅

**Visit:** http://localhost:3000/cart

**Or click Cart icon in navigation (with items)**

**When cart is empty:**
- [ ] "Your cart is empty" message displays
- [ ] "Continue Shopping" button is visible
- [ ] Clicking button goes to /shop

**After adding items:**

**Elements to verify:**
- [ ] All added items display with:
  - [ ] Product image
  - [ ] Product name
  - [ ] Price per unit
  - [ ] Quantity controls (+/- buttons)
  - [ ] Item line total
  - [ ] Remove button (X icon)

**Test Cart Operations:**
- [ ] Increase quantity:
  - [ ] Click "+" → quantity increases
  - [ ] Price updates automatically
  - [ ] Total updates
- [ ] Decrease quantity:
  - [ ] Click "-" → quantity decreases (stops at 1)
  - [ ] Price updates
  - [ ] Total updates
- [ ] Remove item:
  - [ ] Click "X" button → item removed
  - [ ] Total updates
  - [ ] Cart count in navbar updates
- [ ] Clear Cart button:
  - [ ] Removes all items
  - [ ] Shows empty state
  - [ ] Cart count becomes 0

**Verify Order Summary:**
- [ ] Subtotal calculation is correct (sum of all items)
- [ ] Total displays at bottom
- [ ] "Proceed to Checkout" button visible and enabled

---

### Phase 6: Checkout & Order ✅

**From cart, click "Proceed to Checkout"**

**Form Validation:**
- [ ] Try submitting empty form
  - [ ] Error messages show for Name, Phone, Address
  - [ ] Toast shows validation error
- [ ] Enter invalid phone (less than 7 digits)
  - [ ] Error message shows
- [ ] Fill valid data:
  - [ ] Name: "John Doe"
  - [ ] Phone: "92123456789"
  - [ ] Address: "123 Main St, City"
  - [ ] Notes: "Deliver after 5 PM" (optional)

**Order Sidebar:**
- [ ] Order summary shows all items
- [ ] Item quantities are correct
- [ ] Total price is accurate
- [ ] Item count matches cart

**Submit Order:**
- [ ] Click "Place Order" button
- [ ] Loading state appears
- [ ] Request completes
- [ ] Redirects to confirmation page
- [ ] URL changes to /order-confirmation/[id]

---

### Phase 7: Order Confirmation ✅

**After successful checkout**

**Elements to verify:**
- [ ] "Order Confirmed!" heading displays
- [ ] Order ID shows clearly (can copy)
- [ ] Customer details echo back:
  - [ ] Name matches entered value
  - [ ] Phone matches
  - [ ] Address matches
- [ ] Order items list shows:
  - [ ] Each product with quantity
  - [ ] Total amount
  - [ ] Correct calculations
- [ ] "Next Steps" section provides guidance
- [ ] "Continue Shopping" button navigates to /shop
- [ ] "Back to Home" button navigates to /

---

### Phase 8: Admin Login ✅

**Visit:** http://localhost:3000/admin/login

**Or click "Admin" in navbar → redirects to login for non-authenticated**

**Form Validation:**
- [ ] Submit empty form → error messages show
- [ ] Enter wrong username or password → "Invalid credentials" message
- [ ] Enter correct credentials (created by init-admin):
  - Username: `admin`
  - Password: (from init-admin output)
  - Click "Login"
  - Toast shows "Login successful"
  - Redirects to /admin/dashboard
  - Token stored in localStorage

**Verify Token Storage:**
- [ ] Open DevTools → Application tab
- [ ] LocalStorage → Check `auth` key contains token
- [ ] Token format is JWT (three parts separated by dots)

---

### Phase 9: Admin Dashboard ✅

**After successful admin login**

**Navigation:**
- [ ] Sidebar shows on desktop
- [ ] Hamburger menu shows on mobile (click to open)
- [ ] Sidebar items: Dashboard, Products, Orders
- [ ] Admin username shows in sidebar
- [ ] Logout button visible

**Dashboard Metrics:**
- [ ] Total Products card shows number
- [ ] Total Orders card shows number
- [ ] Pending Orders card shows number
- [ ] Completed Orders card shows number
- [ ] All numbers are calculated correctly from database

**Dashboard Actions:**
- [ ] "View All Products" button navigates to /admin/products
- [ ] "View All Orders" button navigates to /admin/orders

**Responsive Design:**
- [ ] Desktop: sidebar visible, content wide
- [ ] Mobile (375px): sidebar in hamburger menu

---

### Phase 10: Admin Products Management ✅

**Navigate to:** /admin/products

**Initial State (No products):**
- [ ] "No products found" message
- [ ] "Add New Product" button visible

**Create Product:**
- [ ] Click "Add New Product"
- [ ] Form page loads
- [ ] Form validation works (try submit empty)

**Fill Product Form:**
- [ ] Name: "Summer Dress"
- [ ] Category: Select "Women"
- [ ] Price: "1500"
- [ ] Description: "Beautiful summer dress made with premium cotton"
- [ ] Stock: "100"
- [ ] Upload images:
  - [ ] Click image upload area
  - [ ] Select image file
  - [ ] Progress bar shows upload progress
  - [ ] Image thumbnail appears
  - [ ] Can upload multiple images
  - [ ] Can remove uploaded images

**Save Product:**
- [ ] Click "Add Product" button
- [ ] Loading state shows
- [ ] Redirects to products list
- [ ] New product appears in table
- [ ] Toast shows "Product added successfully"

**View Products Table:**
- [ ] Columns show: Image, Name, Category, Price, Stock
- [ ] Product image thumbnail displays correctly
- [ ] Edit button (pencil icon) is visible
- [ ] Delete button (trash icon) is visible

**Edit Product:**
- [ ] Click edit button
- [ ] Form pre-fills with existing data
- [ ] Can modify any field
- [ ] Can add more images
- [ ] Can remove images
- [ ] Click "Update Product"
- [ ] Redirects to list
- [ ] Changes reflected in table

**Delete Product:**
- [ ] Click delete button
- [ ] Confirmation prompt appears (if implemented)
- [ ] Product removed from table
- [ ] Toast shows success message
- [ ] Can no longer view product on customer side

---

### Phase 11: Admin Orders Management ✅

**Navigate to:** /admin/orders

**Create customer orders first (via checkout process, see Phase 6)**

**View Orders:**
- [ ] All orders display in collapsible accordion
- [ ] Each order shows:
  - [ ] Customer name
  - [ ] Customer phone
  - [ ] Current status badge (color-coded)
  - [ ] Expand arrow

**Expand Order Details:**
- [ ] Click order to expand
- [ ] Shows:
  - [ ] Full address
  - [ ] Optional notes
  - [ ] Itemized list with:
    - [ ] Product names and images
    - [ ] Quantities
    - [ ] Prices
    - [ ] Line totals
  - [ ] Order total
  - [ ] Order creation date

**Update Order Status:**
- [ ] Status dropdown appears in expanded view
- [ ] Current status is selected
- [ ] Can select new status:
  - [ ] pending → contacted
  - [ ] contacted → completed
  - [ ] Any → any (if needed)
- [ ] Click save/update button
- [ ] Status updates immediately
- [ ] Refresh page → status persists
- [ ] Toast shows "Order updated successfully"

---

### Phase 12: Logout & Session ✅

**As logged-in admin:**

**Logout:**
- [ ] Click "Logout" button in sidebar
- [ ] Redirects to /admin/login
- [ ] Token cleared from localStorage
- [ ] Cannot access /admin without logging in again

**Access Protection:**
- [ ] Direct URL to /admin → redirects to login
- [ ] Direct URL to /admin/products → redirects to login
- [ ] Direct URL to /admin/orders → redirects to login

**Session Persistence:**
- [ ] Login
- [ ] Refresh page (F5)
- [ ] Still logged in (token in localStorage)
- [ ] Page loads dashboard (not login page)
- [ ] Clear localStorage
- [ ] Refresh page → redirects to login

---

### Phase 13: Responsive Design ✅

**Test on different screen sizes:**

**Mobile (375px width):**
- [ ] Navigation burger menu works
- [ ] Product grid: 1 column layout
- [ ] Cart items stack properly
- [ ] Forms are readable and inputs are touch-friendly
- [ ] Images scale appropriately
- [ ] No horizontal scroll
- [ ] Buttons are at least 44px tall

**Tablet (768px width):**
- [ ] Navigation shows properly
- [ ] Product grid: 2 columns
- [ ] Cart layout optimized
- [ ] Admin sidebar collapses if needed
- [ ] Tables are scrollable or responsive

**Desktop (1200px+ width):**
- [ ] Full layout displays
- [ ] Product grid: 4 columns
- [ ] Sidebar always visible (admin)
- [ ] All elements properly aligned

---

### Phase 14: Error Handling ✅

**Test error scenarios:**

**Network Issues:**
- [ ] Disable network (DevTools → Network tab → Offline)
- [ ] Try to load products → error handling
- [ ] Try to place order → error message shows
- [ ] Enable network → retry works

**Invalid Data:**
- [ ] Try to access invalid product ID in URL
- [ ] Should show 404 or error message
- [ ] Try to access invalid order ID
- [ ] Should show error page

**Database Connection:**
- [ ] Stop MongoDB connection
- [ ] Try to load data → error message
- [ ] Reconnect MongoDB
- [ ] Data loads again

**Form Errors:**
- [ ] Submit form with validation errors
- [ ] Toast shows error message
- [ ] Form doesn't submit
- [ ] Errors are clearly marked

---

### Phase 15: Performance ✅

**Measure Performance:**

**Page Load Time (F12 → Network tab):**
- [ ] Home page: < 2 seconds (first load)
- [ ] Products page: < 1.5 seconds
- [ ] Admin login: < 1 second
- [ ] Admin dashboard: < 1.5 seconds

**Image Loading:**
- [ ] Product images load quickly
- [ ] No layout shift when images load
- [ ] Product thumbnails load instantly

**API Response Times:**
- [ ] GET /api/products: < 500ms
- [ ] GET /api/admin/products: < 500ms
- [ ] GET /api/admin/orders: < 500ms
- [ ] POST /api/orders: < 1000ms

---

### Phase 16: Security ✅

**Authentication:**
- [ ] Cannot access admin routes without token
- [ ] Cannot access protected APIs without token
- [ ] Token stored in localStorage (not easily accessible from other tabs without key)
- [ ] Token sent in Authorization header

**Data Validation:**
- [ ] Forms validate input
- [ ] Phone number requires minimum digits
- [ ] Name and address have character limits
- [ ] Prices cannot be negative

**Password Security:**
- [ ] Admin password is hashed (bcrypt)
- [ ] Clear password never sent in responses
- [ ] Login endpoint validates password securely

---

## Automated Testing (Optional)

### Unit Tests (if added)

```bash
npm run test
```

### End-to-End Tests (if added)

```bash
npm run test:e2e
```

---

## API Testing with Postman/Thunder Client

### Setup

1. **Import collection:**
   - Use [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoint details
   - Or manually create requests in Postman

2. **Environment Variables in Postman:**
```json
{
  "token": "your_jwt_token_here",
  "base_url": "http://localhost:3000"
}
```

### Test Sequences

**Product Management Flow:**
1. POST /api/admin/login → Get token
2. POST /api/admin/products → Create product
3. GET /api/admin/products → List products
4. PUT /api/admin/products/{id} → Update product
5. DELETE /api/admin/products/{id} → Delete product

**Order Flow:**
1. GET /api/products → Get product IDs
2. POST /api/orders → Create order
3. GET /api/orders/{id} → View order
4. GET /api/admin/orders → Admin list
5. PUT /api/admin/orders/{id} → Update status

---

## Load Testing (Optional)

### Basic Load Test with ab (Apache Bench)

```bash
# 1000 requests with 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/api/products
```

### Test with hey

```bash
# Install: go install github.com/rakyll/hey@latest
hey -n 1000 -c 10 http://localhost:3000/api/products
```

---

## Browser DevTools Checklist

### Console Tab
- [ ] No JavaScript errors
- [ ] No warnings (except deprecation warnings)
- [ ] Custom logs show (if added for debugging)

### Network Tab
- [ ] All requests complete successfully (status 200, 201, etc.)
- [ ] Image requests return 200
- [ ] API requests return expected JSON
- [ ] No failed requests (404, 500, etc.)

### Performance Tab
- [ ] Page loads in < 2 seconds
- [ ] No long tasks > 50ms
- [ ] Memory usage is stable (no memory leaks)

### Application Tab
- [ ] LocalStorage stores:
  - [ ] `cart` (Zustand store)
  - [ ] `auth` (Zustand store with token)
- [ ] Cookies are minimal (no unnecessary cookies)

---

## Known Issues & Workarounds

### Issue 1: Images Not Uploading
- **Cause**: Cloudinary credentials invalid
- **Fix**: Verify NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local
- **Workaround**: Use placeholder image URLs for testing

### Issue 2: Orders Not Showing
- **Cause**: MongoDB connection issue
- **Fix**: Verify MONGODB_URI connection string
- **Workaround**: Check MongoDB Atlas cluster is running

### Issue 3: Slow API Responses
- **Cause**: Database indexes not created
- **Fix**: MongoDB Atlas should auto-index, but manually create if needed:
  ```
  db.products.createIndex({name: "text", description: "text"})
  ```

### Issue 4: Login Not Working
- **Cause**: Admin user not created
- **Fix**: Run `npm run init-admin` again
- **Workaround**: Generate admin manually via setup script

---

## Regression Testing

After making changes, run this checklist:

- [ ] Home page loads
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Can login as admin
- [ ] Can create product
- [ ] Can update product
- [ ] Can delete product
- [ ] Can view orders
- [ ] Can update order status

---

## Performance Benchmarks

| Route | Expected Time | Safe Threshold |
|-------|---------------|-----------------|
| GET / | < 500ms | 1000ms |
| GET /products | < 800ms | 1500ms |
| GET /products/[id] | < 300ms | 800ms |
| POST /api/products | < 1000ms | 2000ms |
| GET /api/products | < 500ms | 1000ms |
| POST /api/orders | < 1000ms | 2000ms |
| POST /api/admin/login | < 300ms | 800ms |

---

## Test Report Template

```
Date: ______
Tester: ______
Build Version: ______
Duration: ______

Summary: ______

Phases Tested:
- [ ] Phase 1: Server Startup
- [ ] Phase 2: Home Page
- [ ] Phase 3: Product Browsing
- [ ] Phase 4: Product Details
- [ ] Phase 5: Shopping Cart
- [ ] Phase 6: Checkout
- [ ] Phase 7: Order Confirmation
- [ ] Phase 8: Admin Login
- [ ] Phase 9: Admin Dashboard
- [ ] Phase 10: Products Management
- [ ] Phase 11: Orders Management
- [ ] Phase 12: Logout & Session
- [ ] Phase 13: Responsive Design
- [ ] Phase 14: Error Handling
- [ ] Phase 15: Performance
- [ ] Phase 16: Security

Issues Found:
1. ______
2. ______

Recommendations:
- ______
```

---

## Success Criteria

✅ **All tests pass when:**
- All 16 phases completed successfully
- No JavaScript console errors
- No network request failures
- Page load times within benchmarks
- Responsive design works on all sizes
- Admin authentication works correctly
- All CRUD operations succeed
- Data persists across sessions

🎉 **Application is production-ready when:**
- All success criteria met
- Zero critical bugs
- Performance benchmarks passed
- Security measures verified
- Documentation complete
- Ready for Vercel deployment

---

Generated: March 16, 2024
Last Updated: March 16, 2024
