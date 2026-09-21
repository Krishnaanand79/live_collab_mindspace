# 🚀 MindSpace LiveCollab Production Deployment Guide

This guide walks you through deploying **MindSpace LiveCollab** to **Render** (Backend API & WebSockets) and **Vercel** (Frontend React + Vite SPA).

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have the following accounts and credentials ready:
1. **GitHub Repository**: Push your latest code to your repository (e.g., `Krishnaanand79/live_collab_mindspace`).
2. **Render Account**: [render.com](https://render.com) (Free tier available).
3. **Vercel Account**: [vercel.com](https://vercel.com) (Free tier available).
4. **MongoDB Atlas URI**: Connection string with read/write permissions (e.g., `mongodb+srv://user:pass@cluster0.mongodb.net/livecollab?retryWrites=true&w=majority`).
5. **Google OAuth Client ID**: From [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
6. **Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/).

---

## 🌐 Part 1: Deploy Backend to Render

Render hosts the persistent Node.js Express server with WebSocket support (`ws`).

### Option A: 1-Click Blueprint (Recommended)
This repository includes a [`render.yaml`](./render.yaml) file for automated setup.
1. In Render, click **New +** > **Blueprint**.
2. Connect your GitHub repository (`Krishnaanand79/live_collab_mindspace`).
3. Render will automatically detect `livecollab-backend` configured with:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
4. Fill in the prompted environment variables (see below) and click **Apply**.

---

### Option B: Manual Web Service Setup
If creating manually:
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** > **Web Service**.
2. Connect your GitHub repository (`Krishnaanand79/live_collab_mindspace`).
3. Configure the service settings:
   | Setting | Value |
   |---|---|
   | **Name** | `mindspace-backend` |
   | **Region** | Choose the closest region to your users |
   | **Branch** | `main` |
   | **Root Directory** | **`backend`** *(Important! Do not leave blank)* |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

4. Scroll down to **Environment Variables** and add the following:
   | Key | Value | Description |
   |---|---|---|
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
   | `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` | Google OAuth Client ID |
   | `JWT_SECRET` | Any long random string | Used for signing tokens |
   | `GEMINI_API_KEY` | `AIzaSy...` | Gemini API key for AI Whiteboard Assistant |
   | `PORT` | `3001` | Server port |
   | `CORS_ORIGIN` | `https://*.vercel.app,http://localhost:3000,http://localhost:5173` | Allowed frontend origins (comma-separated). You will add your exact Vercel URL in Part 3. |

5. Under **Advanced Settings**, set **Health Check Path** to `/`.
6. Click **Create Web Service**.
7. Wait for deployment to complete. Once active, copy your Render URL:
   - Example: `https://mindspace-backend.onrender.com`
8. Verify in your browser: Visit `https://your-backend.onrender.com/` — it should display:
   ```json
   {
     "name": "MindSpace LiveCollab Backend API",
     "status": "healthy"
   }
   ```

---

## 💻 Part 2: Deploy Frontend to Vercel

Vercel hosts the React 19 + Vite client application with client-side SPA routing (`vercel.json`).

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** > **Project**.
2. Import your GitHub repository (`Krishnaanand79/live_collab_mindspace`).
3. In the **Configure Project** screen:
   - **Project Name**: `live-collab-mindspace` (or your chosen name)
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select **`frontend`** *(Critical! If you do not select `frontend`, the build will fail!)*
4. Expand **Environment Variables** and add:
   | Key | Value | Example |
   |---|---|---|
   | `VITE_API_BASE_URL` | Your Render Backend URL | `https://mindspace-backend.onrender.com` |
   | `VITE_WS_BASE_URL` | Your Render WebSocket URL | `wss://mindspace-backend.onrender.com` |
   | `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `...apps.googleusercontent.com` |

   > [!TIP]
   > `VITE_WS_BASE_URL` is automatically derived from `VITE_API_BASE_URL` (`https://` becomes `wss://`), but providing it explicitly is recommended for clarity.

5. Click **Deploy**.
6. Once deployed, copy your assigned Vercel URL:
   - Example: `https://live-collab-mindspace.vercel.app`

---

## 🔗 Part 3: Connect Frontend and Backend

### 1. Update CORS on Render
Now that you have your production Vercel domain:
1. Go back to [Render Dashboard](https://dashboard.render.com/) > Your Web Service > **Environment**.
2. Update the `CORS_ORIGIN` variable to include your exact Vercel URL:
   ```env
   CORS_ORIGIN=https://live-collab-mindspace.vercel.app,https://*.vercel.app,http://localhost:3000
   ```
3. Render will automatically redeploy with the updated CORS policy.

### 2. Update Google OAuth Authorized Origins
For Google Sign-In to work on your Vercel URL:
1. Go to [Google Cloud Console Credentials](https://console.cloud.google.com/apis/credentials).
2. Click on your **OAuth 2.0 Client ID**.
3. Under **Authorized JavaScript origins**, click **+ ADD URI**:
   - `https://live-collab-mindspace.vercel.app`
4. Under **Authorized redirect URIs**, click **+ ADD URI**:
   - `https://live-collab-mindspace.vercel.app`
5. Click **Save** (takes 2-5 minutes to propagate).

---

## ✅ Part 4: Testing & Verification

1. **Open Frontend**: Visit `https://live-collab-mindspace.vercel.app` in your browser.
2. **Google Sign-In / Guest Mode**: Verify authentication works and your profile avatar appears.
3. **Real-time Whiteboard**:
   - Click **Start Whiteboard** or enter a room code.
   - Open the same room URL in an Incognito window or on another device.
   - Draw or add a sticky note — verify it syncs in real-time between both windows!
4. **AI Assistant**: Click the AI button on the whiteboard and ask a question (e.g. "Explain binary search") to verify Gemini proxy integration.

---

## ⚠️ Free Tier Tips & Troubleshooting

- **Render Free Tier Spin-Down**: Render's free web services sleep after 15 minutes of inactivity. The first request after sleep may take ~45–60 seconds to wake up. This is normal behavior for free tier.
- **WebSocket Reconnection**: MindSpace LiveCollab includes automatic WebSocket reconnection logic if the backend takes a few seconds to wake up.
- **SPA 404 on Refresh**: The repository includes `frontend/vercel.json` with rewrite rules to ensure refreshing `/room/:id` or `/history` routes does not trigger a 404.
