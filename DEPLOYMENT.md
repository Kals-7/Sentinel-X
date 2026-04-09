# Sentinel-X Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository
- Backend deployed (Render, Heroku, etc.)

### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   vercel --prod
   ```

### Environment Variables
Set these in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Backend Deployment Options

#### Option 1: Render (Recommended)
1. Create `render.yaml` in backend directory
2. Deploy to GitHub
3. Connect Render to GitHub

#### Option 2: Heroku
1. Create `Procfile`
2. Deploy to Heroku

#### Option 3: Railway
1. Connect Railway to GitHub
2. Deploy automatically

### Configuration Files

#### vercel.json
```json
{
  "version": 2,
  "name": "flowwatch",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://your-backend.onrender.com/api"
  }
}
```

### Deployment Steps

1. **Prepare Code**
   - Remove proxy from package.json
   - Add API URL configuration
   - Create vercel.json

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Configure Environment**
   - Set REACT_APP_API_URL in Vercel dashboard
   - Test API connectivity

### Post-Deployment
- Test all functionality
- Monitor performance
- Set up custom domain (optional)

### Troubleshooting
- Check CORS settings on backend
- Verify API URL environment variable
- Check build logs for errors
- Test API endpoints directly
