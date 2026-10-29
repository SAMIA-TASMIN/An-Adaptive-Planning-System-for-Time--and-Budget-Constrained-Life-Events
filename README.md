# An Adaptive Planning (all JavaScript, Vercel-ready)

**An Adaptive Planning System for Time- and Budget-Constrained Life Events**

```
frontend/   React + Vite + Tailwind (JSX)
backend/    Express + MongoDB (JavaScript, ES modules)
api/        Vercel entry: wraps the Express app as one serverless function
vercel.json build settings + /api rewrite
```

## Run locally
1. Copy `.env.example` to `backend/.env` and fill `MONGO_URI` and `JWT_SECRET`.
2. `npm install` (once, from the repo root; installs frontend and backend)
3. `npm run seed` (demo accounts and 12 packages)
4. `npm run dev`, then open http://localhost:5173

## Deploy on Vercel
1. MongoDB Atlas (free): create a cluster and a database user. Under Network Access add `0.0.0.0/0`.
   Copy the connection string and end it with `/adaptive-planning`.
2. Push this folder to GitHub (`.env` is git-ignored).
3. Vercel > Add New Project > import the repo. Keep Root Directory as the repo root; `vercel.json` does the rest.
4. Environment Variables: `MONGO_URI`, `JWT_SECRET` (long random text), `JWT_EXPIRES` = `7d`.
5. After the first deploy, put the Atlas `MONGO_URI` in `backend/.env` on your computer and run `npm run seed` once.
6. Check `https://YOUR-APP.vercel.app/api/health` returns `{"ok":true}`.

## Demo logins (after `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Client | client@adaptiveplanning.test | client123 |
| Provider | swiftmove@adaptiveplanning.test | provider123 |
| Admin | admin@adaptiveplanning.test | admin123 |

Change these passwords on a public deployment.

## Marketplace events
Twelve packages, one photo each (`frontend/public/images/packages/`).
- **Birthday Party** shows only birthday packages. **Farewell** shows only farewell packages.
- **Other Events** shows all remaining events together: wedding, proposal, special-day celebration, home decor, special-occasion venue, family tour, moving, packing, road trip, Cox's Bazar.
- To add an event: add a line to `packages` in `backend/src/scripts/seedDemo.js` (or create a package as a provider) and run `npm run seed`.

## Payments (bKash and Nagad)
- Hiring a package opens a checkout: choose bKash or Nagad, enter the wallet number, choose the amount (full, 20% advance, or any amount), then the verification code and PIN. The booking is created only when the first payment succeeds.
- The Bookings tab shows total booked, total paid and still to pay, and for every booking: total, paid, due, a payment bar, and the full payment history (method, transaction ID, date).
- Remaining money can be paid any time ("Pay ৳ ..." button), in one or several payments.
- When a booking is paid in full a **payment slip** (receipt number, every transaction, PAID stamp) opens, with Print / Save PDF. It stays available under "View slip".
- If a provider declines a paid booking it shows "Refund pending".
- Rules live in `backend/src/models/booking.model.js` (min advance 20%, valid 11-digit number, no overpaying).

**The payment gateway is a sandbox.** `backend/src/utils/gateway.js` creates a transaction ID but does not move real money, and the code/PIN screens are only for the look of the flow (nothing is sent or stored). To take real payments, get a merchant account and API keys from bKash and Nagad and replace the body of `charge()` there; nothing else needs to change.
