# 🚀 How to Start the Gemini Chatbot Servers

## ✅ **Correct Commands to Start Servers**

### **Backend Server (Terminal 1):**

```bash
cd /c/Users/dozdo/backend
npm run simple
```

### **Frontend Server (Terminal 2):**

```bash
cd /c/Users/dozdo/frontend
npm run start
```

## 🎯 **Alternative Commands (if the above don't work):**

### **Backend:**

```bash
cd C:\Users\dozdo\backend
npm run simple
```

### **Frontend:**

```bash
cd C:\Users\dozdo\frontend
npm run start
```

## 📊 **Server Status Check:**

### **Check if servers are running:**

```bash
# Check backend (port 3000)
netstat -an | findstr :3000

# Check frontend (port 4200)
netstat -an | findstr :4200
```

## 🔐 **Test Credentials:**

- **Username:** `testuser`
- **Password:** `password`

## 🌐 **Access URLs:**

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000

## ❌ **Commands that DON'T work:**

- `npx ng serve` (causes "npm error could not determine executable to run")
- `ng serve` (command not found)
- `cd ../backend` (wrong directory)
- `npm run start` from wrong directory (causes "ENOENT: no such file or directory")

## ✅ **Commands that DO work:**

- `npm run start` (for frontend - must be in frontend directory)
- `npm run simple` (for backend - must be in backend directory)
- Full absolute paths

## 🔧 **Troubleshooting:**

### **If you get "ENOENT: no such file or directory":**

1. Make sure you're in the correct directory:

   ```bash
   # For frontend
   cd /c/Users/dozdo/frontend
   dir  # Should show package.json

   # For backend
   cd /c/Users/dozdo/backend
   dir  # Should show package.json
   ```

2. Then run the start command:
   ```bash
   npm run start  # for frontend
   npm run simple # for backend
   ```

### **If servers are already running:**

- Frontend: http://localhost:4200 ✅
- Backend: http://localhost:3000 ✅

## 🎉 **Ready to Test!**

Once both servers are running, open your browser to **http://localhost:4200** and start chatting with Gemini AI!

### **Current Status:**

- ✅ Backend server running on port 3000
- ✅ Frontend server running on port 4200
- ✅ Both servers ready for testing
