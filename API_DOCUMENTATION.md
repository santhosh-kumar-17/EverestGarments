# 📚 API Documentation - Everest Garments

Complete API reference for the textile catalog ordering system.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com` (after deployment)

## Authentication

Admin endpoints require JWT authentication:

```
Authorization: Bearer <token>
```

Get token from `/api/admin/login` endpoint.

---

## Public APIs (No Authentication Required)

### Products

#### Get All Products

```
GET /api/products
```

**Query Parameters:**
- `category` (optional): "Women" or "Kids"
- `search` (optional): Search text for name or description

**Example:**
```
GET /api/products?category=Women&search=dress
```

**Response:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Summer Dress",
      "category": "Women",
      "price": 1500,
      "description": "Beautiful summer dress",
      "stock": 50,
      "images": ["https://res.cloudinary.com/..."],
      "createdAt": "2024-03-16T10:30:00Z",
      "updatedAt": "2024-03-16T10:30:00Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

---

#### Get Single Product

```
GET /api/products/{id}
```

**Parameters:**
- `id` (string): Product MongoDB ID

**Example:**
```
GET /api/products/507f1f77bcf86cd799439011
```

**Response:** (Same as product object above)

**Status Codes:**
- `200`: Success
- `400`: Invalid product ID
- `404`: Product not found
- `500`: Server error

---

### Orders

#### Create Order

```
POST /api/orders
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerName": "John Doe",
  "phone": "92123456789",
  "address": "123 Main St, City, Country",
  "notes": "Please deliver after 5 PM",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "name": "Summer Dress",
      "quantity": 2,
      "price": 1500
    }
  ]
}
```

**Required Fields:**
- `customerName`: String (max 100 chars)
- `phone`: String (minimum 7 digits)
- `address`: String (max 500 chars)
- `items`: Array (at least 1 item)

**Optional Fields:**
- `notes`: String (max 500 chars)

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "customerName": "John Doe",
    "phone": "92123456789",
    "address": "123 Main St, City, Country",
    "notes": "Please deliver after 5 PM",
    "items": [...],
    "status": "pending",
    "createdAt": "2024-03-16T10:30:00Z",
    "updatedAt": "2024-03-16T10:30:00Z"
  }
}
```

**Status Codes:**
- `201`: Order created
- `400`: Validation error
- `500`: Server error

---

#### Get Order by ID

```
GET /api/orders/{id}
```

**Parameters:**
- `id` (string): Order MongoDB ID

**Response:** (Order object as above)

**Status Codes:**
- `200`: Success
- `400`: Invalid order ID
- `404`: Order not found
- `500`: Server error

---

## Admin APIs (Authentication Required)

### Authentication

#### Admin Login

```
POST /api/admin/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "your_password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "admin"
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Validation error
- `401`: Invalid credentials
- `500`: Server error

**Save the token** and include it in subsequent requests:
```
Authorization: Bearer <token>
```

---

### Products Management

#### Create Product

```
POST /api/admin/products
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Summer Dress",
  "category": "Women",
  "price": 1500,
  "description": "Beautiful summer dress made with premium cotton",
  "stock": 100,
  "images": [
    "https://res.cloudinary.com/...",
    "https://res.cloudinary.com/..."
  ]
}
```

**Required Fields:**
- `name`: String (1-100 chars)
- `category`: "Women" or "Kids"
- `price`: Number (>= 0)
- `description`: String (1-1000 chars)
- `stock`: Integer (>= 0)
- `images`: Array (at least 1 URL)

**Response:** (Product object)

**Status Codes:**
- `201`: Product created
- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error

---

#### Get All Products (Admin)

```
GET /api/admin/products
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [...]
}
```

---

#### Update Product

```
PUT /api/admin/products/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (string): Product MongoDB ID

**Request Body:** (Same as create, all fields optional)

**Response:** (Updated product object)

**Status Codes:**
- `200`: Success
- `400`: Invalid ID or validation error
- `401`: Unauthorized
- `404`: Product not found
- `500`: Server error

---

#### Delete Product

```
DELETE /api/admin/products/{id}
Authorization: Bearer <token>
```

**Parameters:**
- `id` (string): Product MongoDB ID

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {...}
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid ID
- `401`: Unauthorized
- `404`: Product not found
- `500`: Server error

---

### Orders Management

#### Get All Orders

```
GET /api/admin/orders
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [...]
}
```

---

#### Update Order Status

```
PUT /api/admin/orders/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `id` (string): Order MongoDB ID

**Request Body:**
```json
{
  "status": "contacted"
}
```

**Valid Status Values:**
- `pending`: Initial status
- `contacted`: Salesperson contacted customer
- `completed`: Order completed

**Response:** (Updated order object with new status)

**Status Codes:**
- `200`: Success
- `400`: Invalid ID or status
- `401`: Unauthorized
- `404`: Order not found
- `500`: Server error

---

### Image Upload

#### Upload Image to Cloudinary

```
POST /api/admin/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Parameters:**
- `file` (file): Image file to upload

**Example with cURL:**
```bash
curl -X POST http://localhost:3000/api/admin/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "everest-garments/..."
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: No file provided
- `401`: Unauthorized
- `500`: Upload failed

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "Detailed error information"
}
```

### Common Errors

#### Invalid Credentials
```
Status: 401
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### Unauthorized
```
Status: 401
{
  "success": false,
  "message": "Unauthorized"
}
```

#### Validation Error
```
Status: 400
{
  "success": false,
  "message": "Validation error",
  "error": "name is required"
}
```

#### Not Found
```
Status: 404
{
  "success": false,
  "message": "Product not found"
}
```

#### Server Error
```
Status: 500
{
  "success": false,
  "message": "Failed to fetch product",
  "error": "Connection timeout"
}
```

---

## Rate Limiting

No rate limit currently implemented. For production, consider adding rate limiting:

```bash
npm install express-rate-limit
```

---

## CORS

CORS is configured for:
- Development: `localhost:3000`
- Production: Your deployed domain

To add more origins, update CORS configuration in API routes.

---

## Testing APIs with cURL

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "phone": "92123456789",
    "address": "123 Main St",
    "items": [{
      "productId": "...",
      "name": "Dress",
      "quantity": 1,
      "price": 1500
    }]
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Admin Products
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/admin/products
```

---

## Webhook Support (Optional Future Feature)

Could be added for:
- Order confirmation emails
- SMS notifications
- Third-party integrations
- Inventory sync

---

## API Rate Limits (Recommendations)

For production, implement:
- **Public endpoints**: 100 requests/minute from same IP
- **Admin endpoints**: 50 requests/minute from same IP
- **Upload endpoint**: 10 requests/minute from same IP
- **Login**: 5 attempts/minute per username

---

## API Changelog

### Version 1.0 (Current)
- Initial release
- Product management
- Order management
- Admin authentication
- Image upload to Cloudinary

---

## Support

For API questions or issues:
1. Check error message in response
2. Review request parameters
3. Verify authentication token
4. Check database connection
5. Review server logs

---

Generated: March 16, 2024
Last Updated: March 16, 2024
