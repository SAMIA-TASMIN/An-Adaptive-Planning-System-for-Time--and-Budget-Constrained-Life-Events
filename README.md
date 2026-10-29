# planly
Planly: a web platform that helps people plan time- and budget-constrained life events (parties, moves, road trips) by matching them with service packages and providers.
# Planly

**An Adaptive Planning System for Time- and Budget-Constrained Life Events**

Planly helps people organize life events such as birthday parties, moving
house, road trips and farewells. Clients describe an event, browse ready-made
packages from service providers, book them, and track their tasks in one place.
Admins review and approve generated plans and manage providers.

## Features

**Client**
- Create events and submit them for review
- Browse the marketplace and filter packages by category
- Manage a task checklist for each event
- Request and track bookings

**Provider**
- Create, edit and delete service packages
- View booking requests and update their status
- Dashboard with jobs, availability, reviews and earnings

**Admin**
- Platform overview and statistics
- Approve or reject generated plans
- Activate or suspend providers

**General**
- Role-based access (client, provider, admin) with JWT authentication
- Public home page with marketplace, stats and reviews
- Light/dark theme

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | JSON Web Tokens, bcrypt password hashing |

## Project structure

```
planly/
├── frontend/              React app (Vite)
│   └── src/
│       ├── home/          public landing page sections
│       ├── client/        client panel
│       ├── vendor/        provider panel
│       ├── admin/         admin panel
│       ├── shared/        reusable components
│       └── api/           request helper and data hooks
└── backend/               REST API (Express)
    └── src/
        ├── modules/       auth, public, client, provider, admin
        │                  (each with routes, controllers, services)
        ├── models/        Mongoose models and business rules
        ├── middlewares/   auth, validation, error handling
        └── utils/         shared helpers
```

The backend follows a modular architecture: every request flows
`routes -> controllers -> services -> models`, with business rules kept on the
models (fat model, thin controller).

## Getting started

### Prerequisites
- Node.js 18 or newer
- A MongoDB Atlas cluster (or a local MongoDB)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in your values
npm run seed:admin       # creates the admin account
npm run seed:demo        # optional demo data
npm run dev              # http://localhost:5000
```

`.env` values:

```
PORT=5000
MONGO_URI=<your MongoDB connection string, ending in /planly>
JWT_SECRET=<a long random string>
JWT_EXPIRES=7d
CLIENT_URL=http://localhost:5173
```

Check that it works: http://localhost:5000/api/health

### 2. Frontend

```bash
cd frontend
npm install
npm run dev              # http://localhost:5173
```

In development, Vite proxies `/api` requests to the backend on port 5000.
For production, set `VITE_API_URL` to your deployed backend URL.

## API overview

All routes are under `/api` and return `{ success, message, data }`.

| Area | Examples |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Public | `GET /public/packages`, `GET /public/stats` |
| Client | `/client/events`, `/client/events/:id/tasks`, `/client/bookings` |
| Provider | `/provider/packages`, `/provider/bookings` |
| Admin | `/admin/overview`, `/admin/plans`, `/admin/providers` |

## Roadmap

- AI planning companion chat
- People and invitations for events
- Live mode and helper view
- Review endpoints
- Admin requirement and package moderation

## Security notes

- Never commit your `.env` file. Only `.env.example` belongs in the repo.
- Change `JWT_SECRET` and the seeded demo passwords before deploying.

## Authors

<!-- Add team members and course/university details here -->

## License

<!-- Add a license, e.g. MIT -->
