# An Adaptive Planning backend (Express + MongoDB, JavaScript)

## Rules from the teacher, and where they live
| Rule | How it is done |
|---|---|
| DRY | `src/utils/` holds every shared helper: `crud.js` (generic CRUD, plus `owned()` for one owner's records), `controller.js` (a controller in one line), `response.js`, `messages.js`, `asyncHandler.js`, `pick.js`, `paginate.js`, `token.js` |
| Fat model, thin controller | Rules and state changes are methods on the models (`Booking.request`, `booking.moveTo`, `event.submitForReview`, `plan.decide`, `user.changeStatus`, `user.comparePassword`). Controllers only read the request, call a service and send a reply |
| Modular architecture | One folder per panel in `src/modules/`, each with `routes/`, `controllers/`, `services/` |

## Flow of every request
`routes` (endpoints only) -> `controllers` (response message and status code) -> `services` (database and logic) -> `models` (rules).

## Folders
```
src/
  server.js, app.js, routes.js     start, middleware, one line per panel
  config/                          env.js, db.js
  middlewares/                     auth.js (protect, allow), validate.js, error.js
  validators/                      input rules for each module
  models/                          user, package, event, task, booking, plan, review
  utils/                           shared helpers (DRY)
  modules/
    auth/      register, login, me
    public/    packages (marketplace), stats
    client/    events (+ tasks), bookings
    provider/  packages, bookings
    admin/     overview, plans, packages (approve / reject / suspend), providers (approve / reject / suspend), bookings (+ refund), payments
  scripts/   seedAdmin.js, seedDemo.js
```

## Run
1. Install MongoDB (or use a free MongoDB Atlas cluster).
2. `npm install`
3. Copy `.env.example` to `.env` and fill it in.
4. `npm run seed` (demo accounts, packages and sample bookings), then `npm run dev`
5. Test: http://localhost:5000/api/health

## Endpoints (all under /api, JSON, send `Authorization: Bearer <token>` after login)
- Auth: POST `/auth/register`, POST `/auth/login`, GET `/auth/me`
- Public: GET `/public/packages?event=Wedding` (All | Birthday | Farewell | Wedding | HomeDecor | Moving | Trips | Else), GET `/public/packages/:id`, GET `/public/stats`
- Client: `/client/events` (GET, POST), `/client/events/:id` (GET, PATCH), POST `/client/events/:id/submit`, `/client/events/:eventId/tasks` (GET, POST), `/client/events/:eventId/tasks/:id` (PATCH, DELETE), `/client/bookings` (GET, POST = hire + first payment), POST `/client/bookings/:id/pay`
- Provider: `/provider/packages` (GET, POST), `/provider/packages/:id` (PATCH, DELETE), GET `/provider/bookings`, PATCH `/provider/bookings/:id/status`
- Admin (role admin only):
  - GET `/admin/overview`
  - Plans: GET `/admin/plans?status=`, GET `/admin/plans/counts`, GET `/admin/plans/:id`, POST `/admin/plans/:id/approve|reject`
  - Packages: GET `/admin/packages?status=`, GET `/admin/packages/counts`, GET `/admin/packages/:id`, POST `/admin/packages/:id/approve|reject|suspend` (body `{ comment }`, a reason is required for reject and suspend)
  - Providers: GET `/admin/providers?status=`, GET `/admin/providers/counts`, PATCH `/admin/providers/:id/status` (body `{ status: active|rejected|suspended, comment }`)
  - Bookings: GET `/admin/bookings?status=&payment=unpaid|partial|paid|refund_pending|refunded`, GET `/admin/bookings/counts`, GET `/admin/bookings/:id`, POST `/admin/bookings/:id/refund`
  - Payments: GET `/admin/payments?method=bkash|nagad&q=<transaction id>`, GET `/admin/payments/summary`

Every reply looks like `{ "success": true, "message": "...", "data": ... }`.

## Rules the admin decisions follow
- A package is shown to clients only when it is approved, switched on, and its provider is active.
- A package can be approved only if its provider is active (approve the provider first).
- Rejecting or suspending (a package or a provider) needs a written reason.
- A suspended or rejected provider cannot sign in, and their packages leave the Marketplace.
- If a provider changes the title, price, duration, description, image or groups of a live package, it goes back to pending.
- A refund can be recorded only for a declined booking that has money paid, once.

## Not built yet
Real bKash / Nagad payments (the gateway is a sandbox), People and invites, Live mode, Helper view, Reviews endpoints.
