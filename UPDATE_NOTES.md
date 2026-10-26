# upSkill update notes

## Changes in this update

- Fixed Stripe webhook middleware order so the webhook receives the raw request body required for Stripe signature verification.
- Improved checkout-completed handling so a verified paid order ensures an enrollment exists, including on webhook retries; enrollment count increments only when a new enrollment is inserted.
- Added an authenticated `GET /api/courses/:id/learning` endpoint. It allows an enrolled student, course instructor, or admin to retrieve lesson video URLs; non-enrolled students receive HTTP 403.
- Public course details no longer include non-preview lesson video URLs.
- Course curriculum lessons are clickable. Preview lessons can play without enrollment; protected lessons load after the server confirms access. YouTube watch, youtu.be, embed, and shorts URLs are converted to an embeddable player URL.

## Local setup

1. Open a terminal in `server` and run `npm install`.
2. Copy `server/.env.example` to `server/.env` and fill in your own development values.
3. Start the backend with `npm run dev`.
4. Open another terminal in `client` and run `npm install`.
5. Copy `client/.env.example` to `client/.env` if needed and set `VITE_API_URL=http://localhost:5000/api`.
6. Start the frontend with `npm run dev`.

For Stripe local testing, keep the Stripe CLI listener running and ensure `STRIPE_WEBHOOK_SECRET` matches the current listener's `whsec_...` value. Use Stripe test-mode keys and test cards only.

## Important verification note

The backend JavaScript syntax checks and the updated CourseDetail JSX parser check passed in the preparation environment. A full Vite build could not be completed here because the uploaded `node_modules` did not include the Linux-specific optional Rollup package and dependency installation timed out. Run `npm run build` in `client` on your Windows machine after `npm install`, then complete the five manual tests agreed for this project before deployment.
