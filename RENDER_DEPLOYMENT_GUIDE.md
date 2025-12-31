# Deploying Web Scraper Application to Render

This guide will walk you through deploying your InsightScraper application to Render. The application consists of a React frontend and a Node.js backend with Puppeteer.

## Prerequisites

- A [Render account](https://render.com/) (free tier available)
- Your code pushed to a GitHub repository
- Git installed on your local machine

## Deployment Architecture

You'll deploy two separate services on Render:
1. **Backend Service** - Node.js web service running the Express API with Puppeteer
2. **Frontend Service** - Static site hosting the React application

---

## Part 1: Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
cd "c:\Users\dk675\Downloads\web_scrapper application"
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Part 2: Deploy the Backend Service

### Step 1: Create a New Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your `Web_Scraper_Application` repository

### Step 2: Configure Backend Service

Use these settings:

| Setting | Value |
|---------|-------|
| **Name** | `insight-scraper-backend` (or your preferred name) |
| **Region** | Choose closest to your users |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or paid for better performance) |

### Step 3: Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend-url.onrender.com` (you'll update this later) |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | `true` |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium-browser` |

> **Note**: Render's free tier has Chromium pre-installed. The environment variables tell Puppeteer to use the system Chromium instead of downloading its own.

### Step 4: Create the Service

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (5-10 minutes for first deploy)
3. Once deployed, copy your backend URL (e.g., `https://insight-scraper-backend.onrender.com`)

---

## Part 3: Prepare Frontend for Deployment

### Step 1: Update Frontend API Configuration

You need to configure the frontend to use your Render backend URL instead of localhost.

Create a new file `frontend/.env.production`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual backend URL from Part 2.

### Step 2: Update Frontend Code to Use Environment Variable

Open `frontend/src/App.jsx` and update the API base URL:

```javascript
// At the top of the file, add:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:42069';

// Then update all API calls to use API_URL instead of hardcoded localhost
// For example:
const response = await axios.post(`${API_URL}/api/scrape`, { keyword });
```

### Step 3: Commit and Push Changes

```bash
git add .
git commit -m "Configure frontend for production deployment"
git push origin main
```

---

## Part 4: Deploy the Frontend Service

### Step 1: Create a New Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your `Web_Scraper_Application` repository

### Step 2: Configure Frontend Service

Use these settings:

| Setting | Value |
|---------|-------|
| **Name** | `insight-scraper-frontend` (or your preferred name) |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Step 3: Add Environment Variables

Click **"Advanced"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend-url.onrender.com` |

Replace with your actual backend URL from Part 2.

### Step 4: Create the Static Site

1. Click **"Create Static Site"**
2. Wait for deployment to complete (3-5 minutes)
3. Once deployed, you'll get your frontend URL (e.g., `https://insight-scraper-frontend.onrender.com`)

---

## Part 5: Update Backend CORS Configuration

Now that you have your frontend URL, update the backend to allow requests from it:

### Step 1: Update Backend Environment Variable

1. Go to your backend service in Render Dashboard
2. Navigate to **"Environment"** tab
3. Update the `FRONTEND_URL` variable with your actual frontend URL
4. Click **"Save Changes"**

The backend will automatically redeploy with the new CORS settings.

---

## Part 6: Test Your Deployment

1. Visit your frontend URL (e.g., `https://insight-scraper-frontend.onrender.com`)
2. Try scraping a keyword
3. Verify that data is being scraped and displayed correctly
4. Test the download ZIP functionality

---

## Important Notes

### Free Tier Limitations

> [!WARNING]
> Render's free tier has some limitations:
> - **Services spin down after 15 minutes of inactivity** - First request after inactivity will be slow (30-60 seconds)
> - **750 hours/month limit** across all free services
> - **Limited resources** - May timeout on complex scraping tasks

### Puppeteer on Render

> [!IMPORTANT]
> Puppeteer requires additional configuration on Render:
> - The environment variables we set tell Puppeteer to use system Chromium
> - If you encounter issues, you may need to add a `render.yaml` file (see Advanced Configuration below)

### Build Times

- Backend first deploy: ~5-10 minutes (Puppeteer dependencies are large)
- Frontend first deploy: ~3-5 minutes
- Subsequent deploys: ~2-3 minutes

---

## Advanced Configuration (Optional)

### Using render.yaml for Better Control

Create a `render.yaml` file in your project root for infrastructure-as-code:

```yaml
services:
  # Backend Service
  - type: web
    name: insight-scraper-backend
    runtime: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: npm start
    rootDir: backend
    envVars:
      - key: NODE_ENV
        value: production
      - key: PUPPETEER_SKIP_CHROMIUM_DOWNLOAD
        value: true
      - key: PUPPETEER_EXECUTABLE_PATH
        value: /usr/bin/chromium-browser
      - key: FRONTEND_URL
        sync: false # Set manually in dashboard

  # Frontend Service
  - type: web
    name: insight-scraper-frontend
    runtime: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    rootDir: frontend
    envVars:
      - key: VITE_API_URL
        sync: false # Set manually in dashboard
```

### Custom Domain (Optional)

To use your own domain:
1. Go to your service settings in Render
2. Navigate to **"Custom Domain"** tab
3. Add your domain and follow DNS configuration instructions

---

## Troubleshooting

### Backend Issues

**Problem**: Puppeteer fails to launch browser
- **Solution**: Verify `PUPPETEER_EXECUTABLE_PATH` is set to `/usr/bin/chromium-browser`
- **Alternative**: Add `--no-sandbox` and `--disable-setuid-sandbox` flags in scraper.js

**Problem**: Service times out
- **Solution**: Increase timeout limits or upgrade to paid tier

### Frontend Issues

**Problem**: API calls fail with CORS errors
- **Solution**: Verify `FRONTEND_URL` is correctly set in backend environment variables
- **Check**: Ensure both URLs use HTTPS

**Problem**: Environment variables not working
- **Solution**: Make sure you're using `VITE_` prefix for Vite environment variables
- **Rebuild**: Trigger a manual redeploy after changing environment variables

### General Issues

**Problem**: Slow first request after inactivity
- **Explanation**: Free tier services spin down after 15 minutes
- **Solution**: Upgrade to paid tier for always-on services, or accept the cold start delay

---

## Monitoring and Logs

### Viewing Logs

1. Go to your service in Render Dashboard
2. Click on **"Logs"** tab
3. View real-time logs for debugging

### Monitoring Performance

1. Navigate to **"Metrics"** tab
2. Monitor CPU, memory, and bandwidth usage
3. Set up alerts for service failures

---

## Cost Optimization

- **Free Tier**: Both services can run on free tier
- **Paid Tier**: Starting at $7/month per service for:
  - Always-on services (no spin-down)
  - More resources
  - Better performance
  - Custom domains

---

## Next Steps

After successful deployment:

1. ✅ Test all features thoroughly
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring and alerts
4. ✅ Consider upgrading to paid tier for production use
5. ✅ Implement rate limiting to prevent abuse
6. ✅ Add authentication if needed

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Render Community Forum](https://community.render.com/)
- [Puppeteer on Render Guide](https://render.com/docs/puppeteer)

---

## Summary

You now have:
- ✅ Backend API deployed and running
- ✅ Frontend static site deployed
- ✅ CORS configured correctly
- ✅ Puppeteer working with system Chromium
- ✅ Environment variables configured

Your InsightScraper application is now live and accessible to the world! 🚀
