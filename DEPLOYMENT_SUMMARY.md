# Gemini Chatbot - Deployment Summary

## Overview

The Gemini Chatbot application is deployed using a **two-tier architecture**:

- **Backend**: Deployed on **Render** (Node.js/Express API)
- **Frontend**: Deployed on **Vercel** (Angular application)

## Backend Deployment (Render)

### Service Configuration

- **Platform**: Render.com
- **Service Type**: Web Service
- **Runtime**: Node.js
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Production

### Key Files

- **Entry Point**: `backend/server.js`
- **Package Manager**: npm
- **Database**: PostgreSQL (hosted on Render)

### Environment Variables (Render Dashboard)

```
DATABASE_URL=postgresql://gemini_chatbot_db_user:password@host/database
JWT_SECRET=your_jwt_secret_key_here
KNOWLEDGEBASE_FILE=Comprehensive DHB Bank Conversational Knowledge Base.txt
NODE_ENV=production
```

### Database Setup

- **Provider**: Render PostgreSQL
- **Connection**: External database URL provided by Render
- **Tables**: Users, ChatHistory
- **Migration**: Automatic via Sequelize

### Backend Features

- ✅ User authentication (JWT tokens)
- ✅ Chat history storage
- ✅ Knowledge base integration
- ✅ RESTful API endpoints
- ✅ CORS configuration for frontend

## Frontend Deployment (Vercel)

### Service Configuration

- **Platform**: Vercel.com
- **Framework**: Angular
- **Build Command**: `npm run build`
- **Output Directory**: `dist/frontend/browser`
- **Environment**: Production

### Key Files

- **Entry Point**: `frontend/src/main.ts`
- **Package Manager**: npm
- **Framework**: Angular 17 (with SSR)

### Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "outputDirectory": "dist/frontend/browser"
}
```

### Environment Variables (Vercel Dashboard)

```
API_BASE_URL=https://gemini-chatbot-backend-1rvx.onrender.com/api
```

### Frontend Features

- ✅ User registration/login
- ✅ Chat interface
- ✅ Authentication guards
- ✅ Responsive design
- ✅ SSR (Server-Side Rendering) support

## Deployment Architecture

```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   (Vercel)      │                  │   (Render)      │
│                 │                  │                 │
│ • Angular App   │                  │ • Node.js API   │
│ • Static Files  │                  │ • Express.js    │
│ • SSR Support   │                  │ • PostgreSQL    │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │   (Render)      │
                                    │                 │
                                    │ • Users Table   │
                                    │ • ChatHistory   │
                                    └─────────────────┘
```

## URLs

- **Frontend**: `https://your-vercel-app.vercel.app`
- **Backend**: `https://gemini-chatbot-backend-1rvx.onrender.com`
- **API Base**: `https://gemini-chatbot-backend-1rvx.onrender.com/api`

## Deployment Process

### Backend (Render)

1. **Connect Repository**: Link GitHub repository to Render
2. **Configure Service**: Set build and start commands
3. **Environment Variables**: Add required env vars
4. **Database**: Create PostgreSQL service
5. **Deploy**: Automatic deployment on git push

### Frontend (Vercel)

1. **Connect Repository**: Link GitHub repository to Vercel
2. **Framework Detection**: Vercel auto-detects Angular
3. **Build Settings**: Configure output directory
4. **Environment Variables**: Add API base URL
5. **Deploy**: Automatic deployment on git push

## Key Configuration Files

### Backend (`backend/package.json`)

```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required for Node.js'"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Frontend (`frontend/angular.json`)

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "600kB",
      "maximumError": "1MB"
    }
  ]
}
```

## Troubleshooting

### Common Issues

#### Backend (Render)

- **502 Bad Gateway**: Check runtime logs, verify environment variables
- **Build Failed**: Check build logs, verify dependencies
- **Database Connection**: Verify DATABASE_URL and PostgreSQL service status

#### Frontend (Vercel)

- **404 Errors**: Check `vercel.json` configuration and output directory
- **Build Errors**: Check Angular build logs, verify dependencies
- **API Connection**: Verify API_BASE_URL environment variable

### Monitoring

- **Render**: Built-in logs and metrics dashboard
- **Vercel**: Built-in analytics and performance monitoring
- **Database**: Render PostgreSQL dashboard

## Security Considerations

- ✅ HTTPS enforced on both platforms
- ✅ Environment variables for sensitive data
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation and sanitization

## Cost

- **Render**: Free tier available (limited hours/month)
- **Vercel**: Free tier available (generous limits)
- **PostgreSQL**: Free tier available on Render

## Maintenance

- **Automatic Deployments**: Both platforms deploy on git push
- **Rollback**: Easy rollback to previous deployments
- **Monitoring**: Built-in health checks and logging
- **Scaling**: Automatic scaling based on traffic

## Benefits of This Setup

1. **Separation of Concerns**: Backend and frontend are independent
2. **Scalability**: Each service can scale independently
3. **Cost-Effective**: Free tiers available for both platforms
4. **Developer Experience**: Automatic deployments and easy rollbacks
5. **Performance**: CDN distribution for frontend, optimized backend
6. **Reliability**: Built-in monitoring and health checks

---

_Last Updated: January 2025_
_Deployment Status: ✅ Production Ready_
