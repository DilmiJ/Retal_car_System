# 🚗 CarHub - Car Rental & Sales System

A comprehensive MERN stack car marketplace platform where users can buy, sell, and rent vehicles with an admin approval system.

## 🌟 Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (User, Dealer, Admin)
- OAuth integration ready (Google, Facebook)
- Secure password handling with bcrypt

### 🚙 Car Management
- Add car listings with detailed information
- Upload multiple images (base64 encoding)
- Set cars for sale, rent, or both
- Admin approval workflow for all listings
- Advanced filtering and search functionality

### 👨‍💼 Admin Panel
- Comprehensive dashboard with analytics
- User management system
- Car approval/rejection with notifications
- Real-time system monitoring
- Backend health monitoring

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Interactive components and forms
- Mobile-first approach

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

### Database
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/DilmiJ/Retal_car_System.git
cd Retal_car_System
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**

Create `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://Dilmi:2001dilmi@cluster0.2tc4t.mongodb.net/carhub-database?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=20012002dilmi
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

5. **Start the Application**

Backend (Terminal 1):
```bash
cd backend
npm start
```

Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## 📁 Project Structure

```
Retal_car_System/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── scripts/         # Utility scripts
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   └── App.jsx      # Main app component
│   ├── public/          # Static assets
│   └── index.html       # HTML template
└── README.md
```

## 🔑 Default Admin Account

```
Email: admin2@carhub.com
Password: Admin123
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `POST /api/cars` - Create car listing
- `GET /api/cars/:id` - Get single car
- `PUT /api/cars/:id` - Update car listing

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/cars/:id/approve` - Approve car listing
- `PUT /api/admin/cars/:id/reject` - Reject car listing

## 🎯 Key Features Implemented

- ✅ Complete MERN stack architecture
- ✅ JWT authentication with role-based access
- ✅ Car listing with image upload
- ✅ Admin approval workflow
- ✅ Real-time notifications
- ✅ Advanced search and filtering
- ✅ Responsive design
- ✅ Backend monitoring dashboard
- ✅ Sample data population

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Dilmi J**
- GitHub: [@DilmiJ](https://github.com/DilmiJ)

---

⭐ Star this repository if you found it helpful!
