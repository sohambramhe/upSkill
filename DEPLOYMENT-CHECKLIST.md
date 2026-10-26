# Deployment checklist

## Before deploy
- [ ] Run `npm install` in both `server` and `client`.
- [ ] Set a real MongoDB Atlas URI and allow only appropriate network access.
- [ ] Generate a strong random `JWT_SECRET` (32+ characters).
- [ ] Remove/change seeded demo instructor credentials and sample videos before public launch.
- [ ] Configure Google OAuth allowed origins and client ID if using Google login.
- [ ] Configure Cloudinary keys server-side if using uploads.
- [ ] Configure Stripe test keys and webhook secret; test the webhook before accepting real payments.
- [ ] Use HTTPS on deployed services and set `CLIENT_URL` to exact frontend origin.

## Vercel frontend
- Root directory `client`
- Build `npm run build`
- Output `dist`
- Environment `VITE_API_URL=https://YOUR-API-DOMAIN/api`
- Environment `VITE_GOOGLE_CLIENT_ID=...` (for Google login widget integration when enabled)

## Render/Railway backend
- Root directory `server`
- Build `npm install`
- Start `npm start`
- Set `PORT` if required by host, plus every required server env variable.
- Confirm `https://YOUR-API-DOMAIN/api/health` returns `success: true`.

## Smoke test
- [ ] Home and catalog load
- [ ] Register/login/logout work
- [ ] Instructor can create a draft and publish a course
- [ ] Student can enroll in a free course
- [ ] Stripe test checkout and verified webhook create enrollment
- [ ] Dashboard shows enrolled courses
- [ ] Protected API endpoints reject missing/invalid JWT
