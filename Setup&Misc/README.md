# Gemini Chatbot

A modern web application built with Node.js, Angular, PostgreSQL, and Google Gemini AI integration. This project provides a chat interface where users can interact with Gemini AI through a beautiful and responsive web application.

## 🚀 Features

- **User Authentication**: JWT-based login and registration system
- **Real-time Chat**: Interactive chat interface with Gemini AI
- **Chat History**: Persistent storage of all conversations
- **Modern UI**: Beautiful Angular Material design
- **Responsive Design**: Works on desktop and mobile devices
- **Secure API**: RESTful API with proper authentication

## 🛠️ Technology Stack

### Backend

- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **JWT** authentication
- **Google Gemini AI** integration
- **bcryptjs** for password hashing

### Frontend

- **Angular 17** with standalone components
- **Angular Material** for UI components
- **Reactive Forms** for form handling
- **HTTP Client** for API communication
- **TypeScript** for type safety

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **Angular CLI** (v17 or higher)
- **Google Gemini API Key** (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Gemini-Chatbot
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration:
# DB_PASSWORD=your_postgres_password
# JWT_SECRET=your_jwt_secret
# GEMINI_API_KEY=your_gemini_api_key

# Create PostgreSQL database
createdb -U postgres gemini_chatbot_dev

# Run database migrations
npx sequelize-cli db:migrate

# Start the backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
ng serve
```

### 4. Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

### Chat Endpoints

#### Send Message

```http
POST /api/chat/sendMessage
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "message": "Hello, how are you?"
}
```

#### Get Chat History

```http
GET /api/chat/history?page=1&limit=20
Authorization: Bearer <jwt_token>
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=gemini_chatbot_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🗄️ Database Schema

### Users Table

- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `role` (Default: 'User')
- `createdAt`
- `updatedAt`

### ChatHistories Table

- `id` (Primary Key)
- `user_id` (Foreign Key to Users)
- `message` (User message)
- `response` (AI response)
- `timestamp`
- `createdAt`
- `updatedAt`

## 🎯 Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Start Chatting**: Send messages to Gemini AI and receive intelligent responses
3. **View History**: All conversations are automatically saved and can be viewed
4. **Logout**: Securely logout when done

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for secure cross-origin requests
- **SQL Injection Protection**: Using Sequelize ORM

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Ensure PostgreSQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Gemini API Errors**

   - Verify your API key is correct
   - Check API quota limits
   - Ensure internet connection

3. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Update Angular CLI
   - Check TypeScript version compatibility

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Note**: Remember to test the backend once the frontend is complete! 🧪
