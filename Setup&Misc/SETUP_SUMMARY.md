# Gemini Chatbot - Database & Authentication Setup Summary

## ✅ What's Already Implemented

### Backend (Node.js + Express + PostgreSQL)

- **Database Models**: User and ChatHistory with proper relationships
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Endpoints**: Register, Login, Send Message, Get Chat History
- **Middleware**: Authentication middleware for protected routes
- **Database Configuration**: PostgreSQL setup with Sequelize ORM

### Frontend (Angular)

- **Authentication Service**: Login, Register, Token management
- **API Service**: HTTP client with automatic token headers
- **Chat Service**: Send messages and get chat history
- **User Interface**: Login/Register components, Chat interface

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR UNIQUE NOT NULL,
  "email" VARCHAR UNIQUE NOT NULL,
  "password" VARCHAR NOT NULL, -- bcrypt hashed
  "role" VARCHAR DEFAULT 'User',
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);
```

### ChatHistories Table

```sql
CREATE TABLE "ChatHistories" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
  "message" TEXT,
  "response" TEXT,
  "timestamp" TIMESTAMP DEFAULT NOW(),
  "createdAt" TIMESTAMP NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL
);
```

## 🔐 Authentication Flow

1. **User Registration**: POST `/api/auth/register`

   - Validates unique username/email
   - Hashes password with bcrypt
   - Returns JWT token

2. **User Login**: POST `/api/auth/login`

   - Verifies credentials
   - Returns JWT token

3. **Protected Routes**: All chat endpoints require JWT token
   - `Authorization: Bearer <token>` header
   - Middleware validates token and sets `req.user`

## 🚀 Quick Setup Instructions

### 1. Install PostgreSQL

- Download from https://www.postgresql.org/download/
- Remember the password you set for `postgres` user

### 2. Create Database

```bash
psql -U postgres
CREATE DATABASE gemini_chatbot_dev;
\q
```

### 3. Configure Database

Update `backend/config/database.js` with your PostgreSQL password:

```javascript
password: "your_postgres_password";
```

### 4. Initialize Database

```bash
cd backend
npm run setup-db
npm run seed-user
```

### 5. Start Servers

```bash
# Backend (Terminal 1)
cd backend
npm run simple

# Frontend (Terminal 2)
cd frontend
ng serve
```

## 🧪 Test Credentials

- **Username**: testuser
- **Password**: password123
- **Email**: test@example.com

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Chat (Protected)

- `POST /api/chat/sendMessage` - Send message to AI
- `GET /api/chat/history` - Get user's chat history

## 🔧 Key Features

### Enhanced Knowledge Base

- **Increased Context Limit**: From 800 to 50,000 characters
- **Comprehensive Search**: Returns multiple relevant sections
- **Full Knowledge Base**: Access to complete Dux8 Consulting information

### User Management

- **Secure Authentication**: JWT tokens with bcrypt password hashing
- **User Sessions**: Persistent login with localStorage
- **Chat History**: Per-user conversation history
- **Role-based Access**: Support for Admin/User roles

### Database Features

- **PostgreSQL**: Robust, scalable database
- **Sequelize ORM**: Type-safe database operations
- **Migrations**: Version-controlled database schema
- **Relationships**: Proper foreign key constraints

## 🛠️ Development Scripts

```bash
# Database setup
npm run setup-db      # Initialize database tables
npm run seed-user     # Create test user

# Server management
npm run simple        # Start backend server
npm run dev-simple    # Start with auto-reload
```

## 🔍 Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check credentials in `config/database.js`
- Verify database exists: `psql -U postgres -d gemini_chatbot_dev`

### Authentication Issues

- Check JWT token in localStorage
- Verify token format: `Bearer <token>`
- Ensure user exists in database

### Frontend Issues

- Check CORS settings in backend
- Verify API base URL in `api.service.ts`
- Check browser console for errors

## 📊 System Architecture

```
Frontend (Angular) ←→ Backend (Node.js/Express) ←→ PostgreSQL Database
                        ↓
                   Gemini AI API
                        ↓
              Knowledge Base Service
```

The system is now fully functional with:

- ✅ PostgreSQL database with user authentication
- ✅ JWT-based secure authentication
- ✅ Per-user chat history
- ✅ Enhanced knowledge base with full context
- ✅ Complete frontend-backend integration
