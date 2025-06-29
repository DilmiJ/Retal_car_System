# CarHub Backend API

A comprehensive MERN stack backend for a car buying, selling, and renting platform.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - OAuth integration (Google, Facebook)
  - Role-based access control (User, Dealer, Admin)
  - Password reset and email verification

- **Car Management**
  - CRUD operations for car listings
  - Advanced search and filtering
  - Image upload with base64 encoding
  - Favorites system
  - View tracking and analytics

- **User Management**
  - User profiles and preferences
  - Dealer verification system
  - Account management

- **Security Features**
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers
  - Account lockout protection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Base64 image handling

## 📁 Project Structure

```
backend/
├── config/
│   ├── database.js      # MongoDB connection
│   └── passport.js      # OAuth configuration
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   ├── User.js          # User schema
│   └── Car.js           # Car schema
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User management routes
│   ├── cars.js          # Car management routes
│   └── upload.js        # File upload routes
├── utils/
│   └── jwt.js           # JWT utilities
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies
```

## 🔧 Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_APP_ID=your_facebook_app_id
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   SESSION_SECRET=your_session_secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/facebook` - Facebook OAuth
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/avatar` - Update user avatar
- `PUT /api/users/change-password` - Change password
- `PUT /api/users/dealer-info` - Update dealer information
- `DELETE /api/users/account` - Delete user account

### Cars
- `GET /api/cars` - Get all cars (with filtering)
- `GET /api/cars/:id` - Get single car
- `POST /api/cars` - Create car listing
- `PUT /api/cars/:id` - Update car listing
- `DELETE /api/cars/:id` - Delete car listing
- `POST /api/cars/:id/favorite` - Toggle favorite
- `GET /api/cars/favorites` - Get user favorites
- `GET /api/cars/my-listings` - Get user's listings
- `PATCH /api/cars/:id/status` - Update car status

### Upload
- `POST /api/upload/image` - Upload single image (base64)
- `POST /api/upload/images` - Upload multiple images (base64)
- `POST /api/upload/validate` - Validate image format
- `GET /api/upload/limits` - Get upload limits

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in requests:

```javascript
// Header
Authorization: Bearer <your_jwt_token>

// Or as cookie
Cookie: token=<your_jwt_token>
```

## 🖼️ Image Upload

Images are handled as base64 encoded strings:

```javascript
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "filename": "car-image.jpg",
  "isPrimary": true
}
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔍 Search & Filtering

Cars can be filtered by:
- Price range (`minPrice`, `maxPrice`)
- Year range (`minYear`, `maxYear`)
- Make, model, category
- Fuel type, transmission
- Location (city, state)
- Listing type (sale, rent, both)
- Condition

## 📊 Health Check

Check API status:
```bash
GET /health
```

Response:
```json
{
  "status": "OK",
  "message": "CarHub API is running",
  "timestamp": "2025-06-29T07:32:12.677Z",
  "environment": "development"
}
```

## 🚀 Deployment

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure OAuth credentials
5. Deploy to your preferred platform

## 📝 Notes

- MongoDB connection credentials need to be properly configured
- OAuth requires setting up Google and Facebook apps
- Base64 images have a 5MB size limit per image
- Rate limiting is applied to sensitive endpoints
- All passwords are hashed using bcrypt
- Email verification and password reset tokens expire after 24 hours and 10 minutes respectively
