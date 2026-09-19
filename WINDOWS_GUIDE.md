# Running LiveCollab on Windows

## What Was Configured
1. **Windows Dependency Installation**:
   - Installed all required `npm` dependencies for Windows in `frontend/` (Vite, React 19, Lucide, Tailwind/CSS tools, and native Windows bindings).
   - Verified `backend/` dependencies on Windows Node.js (v24).
2. **Frontend Environment Configuration**:
   - Created `frontend/.env` with local API & WebSocket endpoints (`http://localhost:3001` and `ws://localhost:3001`).
3. **One-Command Unified Launchers**:
   - Configured root `package.json` with `concurrently` so you don't need to manually open multiple terminals.
   - Added `start-windows.bat` (double-clickable from Windows File Explorer).
   - Added `start-windows.ps1` for PowerShell.

---

## How to Run

### Method 1: Single Command (Terminal)
In your terminal, navigate to the project directory and run:
```bash
npm run dev
```
*(This starts both the Backend on `http://localhost:3001` and Frontend on `http://localhost:3000` simultaneously)*

### Method 2: Double-Click Launcher (File Explorer)
Double-click `start-windows.bat` in File Explorer.

### Method 3: Separate Terminals (Optional)
If you prefer running them in separate terminal windows:
- **Terminal 1 (Backend)**:
  ```bash
  cd livecollab/backend
  npm run dev
  ```
- **Terminal 2 (Frontend)**:
  ```bash
  cd livecollab/frontend
  npm run dev
  ```

---

## Ports and Access
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API & WebSocket**: [http://localhost:3001](http://localhost:3001)
