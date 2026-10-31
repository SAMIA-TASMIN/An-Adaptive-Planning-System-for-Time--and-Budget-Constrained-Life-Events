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
3. `npm run seed` (demo accounts, packages and sample bookings)
4. `npm run dev`, then open http://localhost:5173

## Deploy on Vercel (short version, full guide in `DEPLOY-VERCEL.md`)
1. MongoDB Atlas (free): create a cluster and a database user. Under Network Access add `0.0.0.0/0`.
   Copy the connection string and put the database name `an-adaptive-planning` before the `?`.
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

Change these passwords on a public deployment (the admin one with `ADMIN_PASSWORD=... npm run seed`).

## Marketplace groups
The Marketplace chips (and the "What we plan" buttons on the home page) are: **All, Birthday Party, Farewell, Wedding & Proposal, Home Decor, Moving Home, Trips & Tour, Something Else**.
One package can sit in more than one group (the `events` list of a package):

| Group | Packages |
|---|---|
| Wedding & Proposal | Wedding ceremony package, Proposal setup |
| Home Decor | Home decor for functions, Special occasion venue decor, Packing service, Moving crew, 2 rooms |
| Moving Home | Packing service, Moving crew, 2 rooms |
| Trips & Tour | Cox's Bazar weekend, Road trip planner, Family tour package |
| Something Else | Celebrate a day with someone special, Special occasion venue decor |
| Birthday Party / Farewell | Birthday party kit / Farewell setup |

To change a group, edit the `events` list of that package in `backend/src/scripts/seedDemo.js` and run `npm run seed` again. A provider chooses the groups when creating a package (Vendor > Packages).

## What the admin can do
| Tab | Work |
|---|---|
| Overview | What is waiting (plans, packages, providers, refunds) and the money (received, still to collect, booked) |
| Plan approvals | Approve or reject a client's plan, with a comment |
| Packages | Approve a provider's package, reject it with a reason, or suspend (take down) a live one |
| Providers | Approve a new provider, reject, suspend or activate again. A suspended provider cannot sign in and their packages are hidden |
| Bookings | Every booking with client, provider, total / paid / due, payment status; open one to see every transaction, the receipt, and record a refund for a declined paid booking |
| Payments | Money received, still to collect, refund pending, money kept, bKash and Nagad totals, and a ledger of every transaction (search by transaction ID) |

Order of approval: approve the **provider** first, then their **packages** (the backend refuses the other order).

## Payments (bKash and Nagad)
- Hiring a package opens a checkout: choose bKash or Nagad, enter the wallet number, choose the amount (full, 20% advance, or any amount), then the verification code and PIN. The booking is created only when the first payment succeeds.
- The Bookings tab shows total booked, total paid and still to pay, and for every booking: total, paid, due, a payment bar, and the full payment history (method, transaction ID, date).
- Remaining money can be paid any time ("Pay ৳ ..." button), in one or several payments.
- When a booking is paid in full a **payment slip** (receipt number, every transaction, PAID stamp) opens, with Print / Save PDF. It stays available under "View slip".
- If a provider declines a paid booking it shows "Refund pending".
- Rules live in `backend/src/models/booking.model.js` (min advance 20%, valid 11-digit number, no overpaying).

**The payment gateway is a sandbox.** `backend/src/utils/gateway.js` creates a transaction ID but does not move real money, and the code/PIN screens are only for the look of the flow (nothing is sent or stored). To take real payments, get a merchant account and API keys from bKash and Nagad and replace the body of `charge()` there; nothing else needs to change.
