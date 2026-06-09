# Netlify Deployment Guide for Carbon Footprint Platform

This guide walks you through deploying the platform using **100% free tiers**.

## 🏗️ Architecture Overview

Since Netlify only hosts static sites and serverless functions, we will split the deployment:

| Component | Platform | Free Tier Limits |
|-----------|----------|------------------|
| **Frontend** (Next.js) | **Netlify** | 100GB bandwidth/mo, Unlimited builds |
| **Backend** (Fastify) | **Render** | 750 hrs/mo (sleeps after 15m inactivity) |
| **Database** (Postgres) | **Neon** | 0.5GB storage, Serverless (never sleeps) |
| **Cache** (Redis) | **Upstash** | 10,000 commands/day |

---

## 🚀 Step-by-Step Deployment

### Phase 1: Database Setup (Neon & Upstash)

#### 1. Create PostgreSQL on Neon
1. Go to [neon.tech](https://neon.tech) and sign up.
2. Create a new project named `carbon-footprint-db`.
3. Copy the **Connection String** (looks like `postgres://user:pass@ep-xyz...`).
4. In the Neon SQL Editor, run your migration files:
   - Copy content from `database/migrations/001_create_users.sql` through `008_create_badges.sql`.
   - Paste and execute them in order.
5. Copy content from `database/seeds/*.sql` and execute to populate initial data.

#### 2. Create Redis on Upstash
1. Go to [upstash.com](https://upstash.com) and sign up.
2. Create a new database (region closest to your users).
3. Copy the **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**.

---

### Phase 2: Backend Deployment (Render)

#### 1. Prepare Backend for Render
Render needs to know where the backend code is. Since our backend is in `/backend`, configure the Root Directory in Render settings.

**Optional: Create root package.json for monorepo support**
Create a `package.json` in the **root** (`/workspace/package.json`):

```json
{
  "name": "carbon-footprint-platform",
  "version": "1.0.0",
  "scripts": {
    "install-backend": "cd backend && npm install",
    "build-backend": "cd backend && npm run build",
    "start-backend": "cd backend && npm run start"
  }
}
```

#### 2. Deploy to Render
1. Push your code to **GitHub**.
2. Go to [render.com](https://render.com) → **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Name**: `carbon-api`
   - **Root Directory**: `backend` (Crucial: tell Render to look inside this folder)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: **Free**
5. Add **Environment Variables** (in Render Dashboard):
   - `DATABASE_URL`: (From Neon)
   - `UPSTASH_REDIS_REST_URL`: (From Upstash)
   - `UPSTASH_REDIS_REST_TOKEN`: (From Upstash)
   - `JWT_SECRET`: (Generate a random string)
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: (Will be your Netlify URL, e.g., `https://your-site.netlify.app`)
6. Click **Create Web Service**.
7. Wait for deployment. Once live, copy the URL (e.g., `https://carbon-api.onrender.com`).

> **Note**: On the free tier, the backend will "sleep" after 15 minutes of inactivity. The first request after sleep takes ~30s to wake up.

---

### Phase 3: Frontend Deployment (Netlify)

#### 1. Configure Environment Variables
In your local project, update `frontend/.env.local` (and later in Netlify UI):

```bash
NEXT_PUBLIC_API_URL=https://carbon-api.onrender.com/api
```

#### 2. Deploy to Netlify
1. Log in to [netlify.com](https://netlify.com).
2. Click **Add new site** → **Import an existing project**.
3. Select **GitHub** and choose your repo.
4. Configure Build Settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Install command**: `npm install`
5. Click **Deploy site**.

#### 3. Set Netlify Environment Variables
Once the site is created:
1. Go to **Site settings** → **Environment variables**.
2. Add:
   - `NEXT_PUBLIC_API_URL`: `https://carbon-api.onrender.com/api`
3. Trigger a new deploy (**Deploys** tab → **Trigger deploy**).

#### 4. Enable Netlify Next.js Plugin
Netlify usually auto-detects Next.js. Ensure the `@netlify/plugin-nextjs` is active in your site's plugins list.

---

### Phase 4: Final Configuration

#### 1. Update CORS in Backend
Ensure your backend allows requests from your new Netlify domain.
In Render environment variables, set:
```
CORS_ORIGIN=https://your-app.netlify.app
```

#### 2. Test the Integration
1. Visit your Netlify URL.
2. Try to register a new user.
3. If it hangs, check the browser console for CORS errors or wait for backend to wake up.

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS Error** | Ensure `CORS_ORIGIN` in Render matches your Netlify URL exactly (no trailing slash). |
| **API 502/Timeout** | Backend is sleeping. Wait 30s for Render to wake it up. |
| **Database Connection Failed** | Check Neon IP allowlist. Set to "Allow connections from anywhere". |
| **Images not loading** | Ensure `next.config.js` has correct `images.domains`. |

## 💰 Cost Summary
- **Netlify**: $0
- **Render**: $0 (with sleep)
- **Neon**: $0
- **Upstash**: $0
- **Total**: **$0/month**

Enjoy your deployed Carbon Footprint Platform! 🌱
