# Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment

- [ ] Push your code to GitHub
  ```bash
  git add .
  git commit -m "Prepare for Render deployment"
  git push origin main
  ```

## Backend Deployment

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Configure backend service:
  - Name: `insight-scraper-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
  
- [ ] Add environment variables:
  - `NODE_ENV` = `production`
  - `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` = `true`
  - `PUPPETEER_EXECUTABLE_PATH` = `/usr/bin/chromium-browser`
  - `FRONTEND_URL` = (leave as `*` for now, update later)

- [ ] Deploy and wait for completion
- [ ] Copy your backend URL: `https://__________.onrender.com`

## Frontend Deployment

- [ ] Create `.env.production` file in `frontend/` directory:
  ```env
  VITE_API_BASE=https://YOUR-BACKEND-URL.onrender.com/api
  ```
  Replace `YOUR-BACKEND-URL` with your actual backend URL from above

- [ ] Commit and push the changes:
  ```bash
  git add frontend/.env.production
  git commit -m "Add production environment config"
  git push origin main
  ```

- [ ] Create new Static Site on Render
- [ ] Configure frontend service:
  - Name: `insight-scraper-frontend`
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`

- [ ] Add environment variable:
  - `VITE_API_BASE` = `https://YOUR-BACKEND-URL.onrender.com/api`

- [ ] Deploy and wait for completion
- [ ] Copy your frontend URL: `https://__________.onrender.com`

## Post-Deployment

- [ ] Update backend CORS:
  - Go to backend service → Environment
  - Update `FRONTEND_URL` to your actual frontend URL
  - Save (will trigger redeploy)

- [ ] Test your application:
  - [ ] Visit frontend URL
  - [ ] Try scraping a keyword
  - [ ] Verify data displays correctly
  - [ ] Test "View Data" functionality
  - [ ] Test "Download ZIP" functionality

## Troubleshooting

If you encounter issues:

1. **Check logs**: Go to service → Logs tab
2. **Verify environment variables**: Ensure all URLs are correct
3. **CORS errors**: Make sure `FRONTEND_URL` is set correctly in backend
4. **Puppeteer errors**: Verify `PUPPETEER_EXECUTABLE_PATH` is `/usr/bin/chromium-browser`
5. **Slow first request**: Normal on free tier - services spin down after 15 min

## URLs to Remember

- Backend URL: `https://__________.onrender.com`
- Frontend URL: `https://__________.onrender.com`
- Render Dashboard: https://dashboard.render.com/

## Next Steps

- [ ] Consider upgrading to paid tier for production use
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring and alerts
- [ ] Add rate limiting to prevent abuse

---

**Need help?** See the full deployment guide in `RENDER_DEPLOYMENT_GUIDE.md`
