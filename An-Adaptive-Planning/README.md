# Planly (frontend + backend together)

```
planly-full/
  frontend/   React + Vite + Tailwind (http://localhost:5173)
  backend/    Express + MongoDB      (http://localhost:5000)
```

Both parts are written in **TypeScript** (strict mode): `.tsx` / `.ts` in `frontend/src`, `.ts` in `backend/src`.

## Run it in VS Code
1. File > Open Folder > choose `planly-full`. Open the terminal (Ctrl + `).
2. Start MongoDB (see below).
3. `npm run setup`   (installs everything, once)
4. `npm run seed`    (adds demo accounts and packages, once)
5. `npm run dev`     (starts backend and frontend together)
6. Open http://localhost:5173

Check the types any time with `npm run typecheck` (runs the TypeScript compiler on both parts).

## MongoDB
- Local: install MongoDB Community Server and make sure the service is running. `backend/.env` already points to `mongodb://127.0.0.1:27017/planly`.
- Or MongoDB Atlas (free): paste your connection string into `MONGO_URI` in `backend/.env`.

## Demo logins (after `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Client | client@planly.test | client123 |
| Provider | swiftmove@planly.test | provider123 |
| Admin | admin@planly.test | admin123 |

On the Sign in page pick the matching role tile first, then sign in.

## What is connected to the backend right now
- Sign in and Create account (clients and providers)
- Home "Popular packages" and the Marketplace (real packages from MongoDB, filter by category)
- Client panel: Marketplace "Hire" button creates a real booking, and the Bookings tab lists it
- Panels open only for a signed-in user with the right role; Sign out clears the session

Everything else (Dashboard, New event, Plan, Tasks, provider and admin pages) still shows sample data until each part is connected.
