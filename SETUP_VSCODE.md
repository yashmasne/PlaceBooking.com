# PlaceBooking.com — Visual Studio Code Setup Guide

## System Requirements
- Node.js 18+ (Node.js 20 or 24 LTS recommended)
- Visual Studio Code on Windows / macOS / Linux

External services (*MongoDB, Cloudinary, Razorpay*) are **optional**; the project runs fully with zero external dependencies in local demo mode.

---

## 1. Open the Project
Open the root directory `PlaceBooking.com-master` in VS Code.

You will find ready-to-use configurations in `.vscode/`:
- **`.vscode/tasks.json`**: Pre-configured tasks to start the backend, start the frontend, run tests, and build.
- **`.vscode/launch.json`**: Debug configuration for the Node.js backend.

---

## 2. Running via Integrated Terminals

### Terminal 1: Backend API
```powershell
cd Server
npm install
npm run dev
```

Server verification:
- Root Test: http://localhost:8000/api/test
- Health Check: http://localhost:8000/api/health
- Places Endpoint: http://localhost:8000/api/places

### Terminal 2: Frontend Web App
```powershell
cd Frontend
npm install
npm run dev
```

Open the Vite local server:
```text
http://localhost:5173
```

---

## 3. Running Automated Tests & Production Builds

### Run Unit Tests
```powershell
cd Server
npm test
```

### Validate Frontend Production Build
```powershell
cd Frontend
npm run build
```

---

## 4. Configuration & Environment Variables

- **Backend Configuration (`Server/.env` & `Server/.env.example`):**
  - `PORT`: Port for the REST API (default: `8000`).
  - `CLIENT_URL`: Allowed frontend origin for CORS (default: `http://localhost:5173`).
  - `JWT_SECRET`: Secret key for authentication token cookies.
  - `USE_MONGO`: Set to `true` to enable MongoDB instead of local JSON storage.
  - `MONGO_URL`: MongoDB connection URI (e.g. `mongodb://127.0.0.1:27017/placebooking`).
  - `CLOUDINARY_*`: Optional Cloudinary image upload credentials.
  - `KEY_ID` & `KEY_SECRET`: Optional Razorpay payment gateway credentials.

- **Frontend Configuration (`Frontend/.env` & `Frontend/.env.example`):**
  - `VITE_API_URL`: Backend API URL (default: `http://localhost:8000/api`).
  - `VITE_UPLOADS_URL`: Base URL for local image uploads (default: `http://localhost:8000`).

---

## 5. Resetting Local Demonstration Data
Local data is persisted automatically in:
```text
Server/data/db.json
```
To reset to factory sample listings, stop the backend server, delete `Server/data/db.json`, and restart the backend.
