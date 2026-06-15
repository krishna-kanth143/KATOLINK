# Shortify Pro - Setup & Deployment Guide

Follow these steps to get Shortify Pro running locally and deploy it to production.

## 💻 Local Development

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Git](https://git-scm.com/)

### 2. Backend Setup
1. Open your terminal in the `backend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```ini
   PORT=5000
   MONGODB_URI=your_mongodb_cluster_uri
   JWT_SECRET=your_super_secret_key
   FRONTEND_URL=http://localhost:5173
   BASE_URL=http://localhost:5000
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 Cloud Deployment

### 1. Database (MongoDB Atlas)
1. Create a free Shared Cluster.
2. Under "Network Access", allow access from anywhere (`0.0.0.0/0`).
3. Under "Database Access", create a user with read/write permissions.
4. Copy your Connection String.

### 2. Backend (Render)
1. Sign up for [Render.com](https://render.com/).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. Set the **Build Command** to `npm install`.
6. Set the **Start Command** to `node server.js`.
7. Add your Environment Variables (`MONGODB_URI`, `JWT_SECRET`, etc.).

### 3. Frontend (Vercel)
1. Sign up for [Vercel.com](https://vercel.com/).
2. Import your GitHub repository.
3. Select the `frontend` folder as the **Root Directory**.
4. Vercel will automatically detect the Vite configuration.
5. Deploy!
