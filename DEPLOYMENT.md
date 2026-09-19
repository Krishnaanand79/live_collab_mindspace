# 🚀 MindSpace LiveCollab Production Deployment Guide

Follow these steps to deploy **MindSpace LiveCollab** to Vercel (Frontend) and Render (Backend).

---

## 🌐 Part 1: Deploy the Backend on Render

Render hosts the persistent Node.js Express server with WebSocket support.

1. Go to [Render.com](https://render.com) and log in.
2. Click **New +** > **Web Service**.
3. Link your GitHub account and select `Krishnaanand79/live_collab_mindspace`.
4. Configure the Web Service:
   - **Name**: `mindspace-backend`
   - **Region**: Select the region closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Advanced** and add these **Environment Variables**:
   - `MONGO_URI` = `<your_mongodb_atlas_connection_string>`
   - `GOOGLE_CLIENT_ID` = `<your_google_oauth_client_id>`
   - `JWT_SECRET` = `<your_jwt_secret>`
   - `GEMINI_API_KEY` = `<your_gemini_api_key>`
   - `PORT` = `3001`
   - `CORS_ORIGIN` = `https://your-frontend.vercel.app`
6. Click **Create Web Service**.
7. Once deployed, copy your Render URL (e.g., `https://mindspace-backend.onrender.com`).

---

## 💻 Part 2: Deploy the Frontend on Vercel

Vercel hosts the React 19 / Vite client application.

1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **Add New** > **Project**.
3. Import `Krishnaanand79/live_collab_mindspace`.
4. Configure the Project:
   - **Root Directory**: Select **`frontend`**.
   - **Framework Preset**: **Vite** (auto-detected).
5. Open **Environment Variables** and add:
   - `VITE_API_BASE_URL` = `https://mindspace-backend.onrender.com`
   - `VITE_WS_BASE_URL` = `wss://mindspace-backend.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID` = `<your_google_oauth_client_id>`
   - `VITE_GEMINI_API_KEY` = `<your_gemini_api_key>`
6. Click **Deploy**.
7. Copy your Vercel URL, go back to Render, and set `CORS_ORIGIN` to match your Vercel domain.
