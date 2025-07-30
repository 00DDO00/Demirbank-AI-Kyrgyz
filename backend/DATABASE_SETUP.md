# PostgreSQL Database Setup Guide

## Prerequisites

1. **PostgreSQL installed** on your system
2. **Node.js and npm** installed
3. **Backend dependencies** installed (`npm install`)

## Step 1: Install PostgreSQL

### Windows

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for the `postgres` user

### macOS

```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Create Database

1. **Open PostgreSQL command line:**

   ```bash
   psql -U postgres
   ```

2. **Create the database:**

   ```sql
   CREATE DATABASE gemini_chatbot_dev;
   ```

3. **Exit PostgreSQL:**
   ```sql
   \q
   ```

## Step 3: Configure Database Connection

1. **Update database credentials** in `config/database.js`:
   ```javascript
   development: {
     username: "postgres",
     password: "your_postgres_password", // Replace with your actual password
     database: "gemini_chatbot_dev",
     host: "127.0.0.1",
     port: 5432,
     dialect: "postgres",
     logging: false,
   }
   ```

## Step 4: Initialize Database

1. **Run database setup:**

   ```bash
   npm run setup-db
   ```

2. **Create test user:**
   ```bash
   npm run seed-user
   ```

## Step 5: Test the Setup

1. **Start the server:**

   ```bash
   npm run simple
   ```

2. **Test authentication endpoints:**

   ```bash
   # Register a new user
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"newuser","email":"new@example.com","password":"password123"}'

   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"password123"}'
   ```

## Database Schema

### Users Table

- `id`: INT, Primary Key, Auto Increment
- `username`: VARCHAR, Unique
- `email`: VARCHAR, Unique
- `password`: VARCHAR (hashed with bcrypt)
- `role`: VARCHAR (Admin, User)

### ChatHistories Table

- `id`: INT, Primary Key, Auto Increment
- `user_id`: INT, Foreign Key (Users)
- `message`: TEXT
- `response`: TEXT
- `timestamp`: TIMESTAMP

## Test User Credentials

- **Username:** testuser
- **Password:** password123
- **Email:** test@example.com

## Troubleshooting

### Connection Issues

- Ensure PostgreSQL is running
- Check database credentials
- Verify database exists

### Migration Issues

- Run `npm run setup-db` to recreate tables
- Check console for error messages

### Authentication Issues

- Ensure JWT_SECRET is set
- Check user credentials
- Verify token format in requests
