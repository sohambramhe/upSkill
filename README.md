# upSkill — Udemy-style MERN course marketplace

A full-stack starter project built with React + Vite + Bootstrap, React Router, Redux Toolkit, Express, MongoDB/Mongoose, JWT/bcrypt, Google OAuth integration hooks, Cloudinary uploads, Stripe Checkout/webhooks, and deployment configs for Vercel + Render/Railway.

## Features included
- Responsive course marketplace, search/category filtering, course detail pages
- Register/login with JWT, bcrypt password hashing, role-based middleware, Google OAuth endpoint scaffold
- MongoDB models for users, courses, enrollments, orders, reviews, and progress
- Instructor course CRUD, lesson structures, Cloudinary signed upload endpoint scaffold
- Stripe Checkout session creation and webhook verification; access is granted only after a verified checkout webhook
- Student dashboard and instructor/admin views
- Redux Toolkit auth/cart state, API service layer
- Health endpoint, environment examples, deployment configs and seed script

## Requirements
Node.js 20+ recommended, npm, MongoDB Atlas account. Stripe and Google/Cloudinary credentials are optional for local UI testing, required for those integrations.

## Run locally (PowerShell)
1. Extract ZIP and open the `upSkill` folder.
2. Backend:
   ```powershell
   cd server
   Copy-Item .env.example .env
   npm install
   # Edit .env and set MONGODB_URI, JWT_SECRET, CLIENT_URL
   npm run seed
   npm run dev
   ```
3. Frontend in a second terminal:
   ```powershell
   cd client
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```
4. Open the Vite URL shown in terminal (usually http://localhost:5173). Backend defaults to http://localhost:5000.

Demo courses are seeded. Register a user to test authentication. To test instructor features, set a user's role to `instructor` in MongoDB or register then update it manually. Never expose production secrets in frontend env variables.

## Environment variables
See `server/.env.example` and `client/.env.example`. Do not commit `.env` files.

## Stripe setup
- Use Stripe test keys in `server/.env`.
- Set Stripe webhook endpoint to `https://YOUR_API/api/payments/webhook` (locally use Stripe CLI forwarding).
- Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
- Checkout does not grant course access on the success redirect. A verified webhook creates the enrollment.
- Add your deployed frontend URL to Stripe redirect URLs via `CLIENT_URL`.

## Google OAuth
Create a Google OAuth web client. Add authorized JavaScript origin(s) for local/deployed frontend. Set `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`. The client sends Google credential JWT to `/api/auth/google`; backend verifies it with `google-auth-library`.

## Cloudinary
Set cloud name, API key and secret on the server. The upload-signature endpoint returns a short-lived signature for direct browser uploads. For production, enforce file size/type and signed/private video delivery according to your Cloudinary plan.

## Deploy
### Backend (Render/Railway)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Set every variable from `server/.env.example` in the host dashboard.
- Set `CLIENT_URL` to the deployed Vercel URL and configure MongoDB Atlas network access securely.

### Frontend (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your deployed backend origin (no trailing slash), and `VITE_GOOGLE_CLIENT_ID`.
- SPA rewrites are included in `client/vercel.json`.

## Important before production
This is a functional starter, not a certified production service. Configure rate limiting, email verification/password reset, moderation, audit logging, robust upload limits, signed video playback, tax/refund policy, Stripe dispute handling, backups, monitoring, accessibility checks, and thorough tests before accepting real users/payments. Only upload content you own or are licensed to distribute.
