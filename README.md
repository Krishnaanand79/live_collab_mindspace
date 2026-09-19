# 🧠 MindSpace — Next-Gen Collaborative Workspace with Agentic AI Co-Pilot

[![Author](https://img.shields.io/badge/Author-Krishnaanand79-6366f1.svg?style=for-the-badge&logo=github)](https://github.com/Krishnaanand79)
[![License](https://img.shields.io/badge/License-MIT-10b981.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![WebRTC](https://img.shields.io/badge/WebRTC-Real--Time-ff6b6b.svg?style=for-the-badge&logo=webrtc)](https://webrtc.org/)

**MindSpace LiveCollab** is a full-stack real-time collaborative workspace platform combining an interactive 60 FPS HTML5 whiteboard, WebSockets, WebRTC audio/video/screen sharing, multi-color draggable sticky notes, and an **Agentic AI Whiteboard Co-Pilot** powered by Google Gemini that can directly create, draw, and organize mind maps, flowcharts, sprint boards, and brainstorming clusters on the live canvas.

---

## ✨ Core Features & Highlights

### 1. 🪄 Autonomous Agentic AI Whiteboard Co-Pilot
- **Active Canvas Action Execution**: The AI doesn't just reply in chat—it generates actionable whiteboard plans (`flowchart`, `template`, `stickies`, `organize`).
- **Interactive "✨ Apply to Whiteboard" Buttons**: The AI renders action cards with summary counts. With a single click, nodes, connecting arrows, titles, and color-coded sticky notes are deployed directly onto the canvas and broadcast room-wide via WebSocket to all connected peers.
- **1-Click Quick Agent Presets**:
  - 🌿 **Flowchart**: Deploys process nodes with directional connectors and reaction stickies.
  - 📋 **Sprint Kanban**: Deploys a 3-column sprint workspace (*TO DO*, *IN PROGRESS*, *COMPLETED*) with task cards.
  - 📊 **SWOT Matrix**: Deploys a 4-quadrant strategic breakdown (*Strengths*, *Weaknesses*, *Opportunities*, *Threats*).
  - 💡 **Ideate Stickies**: Clusters brainstorm cards across the board.
  - 🧹 **Clean Board**: Scans scattered sticky notes and re-aligns them into neat, organized columns.

### 2. 🎨 High-Performance Two-Canvas Whiteboard
- **Dual-Layer Architecture**: Dedicated drawing canvas (bottom) and high-frequency interaction overlay canvas (top) for fluid 60 FPS interaction with zero lag.
- **Canvas Tools**:
  - **Arrow Connector (`↗`)**: Draw straight or diagonal directional arrows with arrowheads to connect ideas.
  - **Straight Line Tool (`―`)**: Draw section dividers and zone boundaries.
  - **Shapes**: Rectangles, circles, and freehand drawing pen.
  - **Laser Pointer**: Glowing trail that automatically fades after 1.5 seconds.
  - **Inline Text**: Click anywhere on the board to type directly.
  - **High-Res PNG Export**: Exports the board with drawings, custom background, and all sticky notes preserved with shadows and word-wrapped text.

### 3. 📝 Draggable Collaborative Sticky Notes
- Color-coded sticky notes (yellow, pink, blue, green) with real-time multi-peer drag-and-drop sync.
- **Auto-Organize Toolbar Button (`🧹`)**: Instantly re-aligns scattered stickies into tidy, non-overlapping columns.

### 4. 🎙️ Hands-Free Voice Dictation (Speech-to-Prompt)
- Integrated Web Speech API microphone button (`.btn-mic`) in the AI chat input, allowing users to speak prompts hands-free while actively sketching.

### 5. 📹 Real-Time WebRTC Media Feeds
- Low-latency peer-to-peer audio, video, and screen sharing.
- Draggable glassmorphic video strip and resizable floating screen share window.

### 6. 🌿 Clean, Natural, Non-Technical Language
- All scientific and mathematical formulas are automatically formatted with clean Unicode (`H₂O`, `CO₂`, `C₆H₁₂O₆`, `O₂`, `➔`) with zero raw LaTeX or unsolicited code blocks.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite | Ultra-fast SPA with Hot Module Replacement |
| **Icons & Styling** | Lucide React + Vanilla CSS | Obsidian Dark glassmorphism & responsive animations |
| **Backend** | Node.js + Express | RESTful API server & Gemini AI Proxy |
| **Real-Time Sync** | `ws` (WebSockets) | Room synchronization, cursor tracking & signaling |
| **Peer-to-Peer** | WebRTC | Direct peer-to-peer video, audio & screen sharing |
| **Database** | MongoDB Atlas / Mongoose | Workspace history & persistent state (with in-memory fallback) |
| **AI Engine** | Google Gemini Multi-Model Cascade | Intelligent agentic whiteboard co-pilot |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Krishnaanand79/live_collab_mindspace.git
cd live_collab_mindspace
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Setup Environment Variables
Copy `.env.example` in `backend/`:
```bash
cp backend/.env.example backend/.env
```
Add your credentials:
```env
MONGO_URI="your-mongodb-atlas-connection-string"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-gemini-api-key"
PORT=3001
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"
```

### 4. Run Locally
```bash
npm run dev
```
> **Windows Users**: You can also simply double-click `start-windows.bat` to launch both servers simultaneously!

- **Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📁 Project Architecture

```
live_collab_mindspace/
├── backend/
│   ├── models/             # Mongoose database schemas (Room, Session, User)
│   ├── server.js           # Express API, WebSocket signaling & Gemini proxy
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Room.jsx    # Core whiteboard workspace & Agentic Co-Pilot
│   │   │   ├── Room.css
│   │   │   ├── Dashboard.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── config.js
│   ├── package.json
│   └── vite.config.js
├── start-windows.bat       # 1-click Windows runner
├── start-windows.ps1       # 1-click PowerShell runner
├── DEPLOYMENT.md           # Cloud deployment guide (Vercel + Render)
├── WINDOWS_GUIDE.md        # Comprehensive Windows setup guide
└── README.md
```

---

## 👤 Author & Creator

Developed with ❤️ by **Krishna Anand**
- GitHub: [@Krishnaanand79](https://github.com/Krishnaanand79)
- Repository: [https://github.com/Krishnaanand79/live_collab_mindspace](https://github.com/Krishnaanand79/live_collab_mindspace)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify for personal and educational projects.
