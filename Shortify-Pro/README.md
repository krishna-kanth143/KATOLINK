# KatoLink (Shortify Pro)

Premium Full-Stack URL Shortener SaaS Platform.

## Features

- **Authentication**: JWT-based secure login/register.
- **URL Management**: Create, Edit, Delete, and Custom Aliases.
- **QR Code System**: Generate and Download QR codes for every link.
- **Advanced Redirects**: Link Expiration and Password Protected Links.
- **Analytics Dashboard**: Real-time telemetry (Socket.io) with Device/Browser/Country tracking.
- **Admin Dashboard**: Manage users and all links platform-wide.
- **Developer API**: API Key generation and external endpoints.
- **Smart Link Preview**: Premium preview page before redirection.
- **Dark Mode**: Sleek dark-mode first design with glassmorphism.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS (v4), Framer Motion, Recharts.
- **Backend**: Node.js, Express, MongoDB Atlas, Socket.io.
- **Deployment**: Vercel (Frontend), Render (Backend).

## Setup Guide

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` from `.env.example`.
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env` from `.env.example`.
4. `npm run dev`

## API Documentation

- `POST /api/auth/register` - Create account.
- `POST /api/auth/login` - Authenticate.
- `POST /api/url/create` - Shorten URL.
- `GET /api/v1/shorten` - Protected Developer API.

## Deployment Guide

- **Backend**: Deploy on Render with `MONGODB_URI` and `JWT_SECRET`.
- **Frontend**: Deploy on Vercel with `VITE_API_URL` pointing to backend Render URL.
