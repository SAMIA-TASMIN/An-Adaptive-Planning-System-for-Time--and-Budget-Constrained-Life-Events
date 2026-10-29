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
  types/                           shared JavaScript types (express.d.ts)
  models/                          user, package, event, task, booking, plan, review
  utils/                           shared helpers (DRY)
  modules/
    auth/      register, login, me
    public/    packages (marketplace), stats
    client/    events (+ tasks), bookings
    provider/  packages, bookings
    admin/     overview, plans (approve / reject), providers
  scripts/seedAdmin.js
```

## Run
1. Install MongoDB (or use a free MongoDB Atlas cluster).
2. `npm install`
3. Copy `.env.example` to `.env` and fill it in.
4. `npm run seed:admin` (creates the admin login), then `npm run dev` (runs the JavaScript directly with tsx)
   - `npm run typecheck` checks the types, `npm run build` compiles to `dist/`, `npm start` runs the compiled code
5. Test: http://localhost:5000/api/health

## Endpoints (all under /api, JSON, send `Authorization: Bearer <token>` after login)
- Auth: POST `/auth/register`, POST `/auth/login`, GET `/auth/me`
- Public: GET `/public/packages?category=Moving`, GET `/public/packages/:id`, GET `/public/stats`
- Client: `/client/events` (GET, POST), `/client/events/:id` (GET, PATCH), POST `/client/events/:id/submit`, `/client/events/:eventId/tasks` (GET, POST), `/client/events/:eventId/tasks/:id` (PATCH, DELETE), `/client/bookings` (GET, POST)
- Provider: `/provider/packages` (GET, POST), `/provider/packages/:id` (PATCH, DELETE), GET `/provider/bookings`, PATCH `/provider/bookings/:id/status`
- Admin: GET `/admin/overview`, GET `/admin/plans?status=generated`, GET `/admin/plans/:id`, POST `/admin/plans/:id/approve`, POST `/admin/plans/:id/reject`, GET `/admin/providers`, PATCH `/admin/providers/:id/status`

Every reply looks like `{ "success": true, "message": "...", "data": ... }`.

## Not built yet
Companion chat, People and invites, Live mode, Helper view, Reviews endpoints, Admin requirements and package moderation, 
