# Quick Setup Guide - Gemini Chatbot

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 17
- Git

### 1. Clone & Setup

```bash
git clone <repository-url>
cd Gemini-Chatbot
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run setup-db
npm start  # NOT npm run simple!
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

### 4. Access Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Database**: PostgreSQL on port 4001

---

## 🔧 Configuration

### Environment Variables (backend/.env)

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key_here
DB_USER=postgres
DB_PASSWORD=Jhgfdsa12345!
DB_NAME=gemini_chatbot_dev
DB_HOST=127.0.0.1
DB_PORT=4001
GEMINI_API_KEY=your_gemini_api_key_here
```

### Database Setup

```sql
-- Connect to PostgreSQL
psql -U postgres -p 4001

-- Create database
CREATE DATABASE gemini_chatbot_dev;
```

---

## 🧪 Testing

### Test User Credentials

- **Username**: testuser
- **Password**: password

### API Testing

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password"}'

# Send message (with token)
curl -X POST http://localhost:3000/api/chat/sendMessage \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"Hello AI!"}'
```

---

## 📊 System Status

### ✅ Working Features

- User registration & login
- JWT authentication
- AI chat with Gemini
- Knowledge base integration
- Chat history persistence
- PostgreSQL database
- Angular frontend

### 🔧 Key Commands

```bash
# Backend
npm start          # Start with database
npm run simple     # Start with in-memory (testing only)

# Database
npm run setup-db   # Setup database tables
npm run seed-user  # Create test user

# Frontend
npm start          # Start Angular dev server
npm run build      # Build for production
```

---

## 🐛 Troubleshooting

### Common Issues

**Users not appearing in database?**

- Make sure you're running `npm start` (not `npm run simple`)
- Check database connection on port 4001
- Restart backend server

**PostgreSQL connection refused?**

- Verify PostgreSQL is running
- Check port configuration (4001)
- Restart PostgreSQL service

**Frontend not loading?**

- Check Angular server on port 4200
- Verify backend API on port 3000
- Check CORS configuration

**AI not responding?**

- Verify Gemini API key
- Check network connectivity
- Review API quota limits

---

## 📚 Documentation Files

- `Gemini Chatbot - Complete System Documentation.md` - Full system documentation
- `API Testing Results & Technical Specifications.md` - Detailed test results
- `Quick Setup Guide.md` - This file

---

## 🎯 System Architecture

```
Frontend (Angular) ←→ Backend (Node.js) ←→ Database (PostgreSQL)
     Port 4200              Port 3000              Port 4001
```

**Key Components:**

- **Authentication**: JWT tokens with bcrypt hashing
- **AI Integration**: Google Gemini AI with knowledge base
- **Database**: PostgreSQL with Sequelize ORM
- **Frontend**: Angular with TypeScript

---

_Last Updated: January 2024_  
_Status: Production Ready_ ✅
