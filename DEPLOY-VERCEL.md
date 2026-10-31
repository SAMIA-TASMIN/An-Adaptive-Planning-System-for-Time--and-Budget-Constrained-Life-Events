# Deploy on Vercel (one project, frontend + backend together)

The repo root is deployed as ONE Vercel project:
- `frontend/` is built with Vite and served as the website.
- `api/index.js` runs the Express backend as a serverless function. `vercel.json` sends every `/api/*` request to it.
- Because the website and the API share one address, there is no CORS setup and no `VITE_API_URL`.

## Step 1. MongoDB Atlas (free)
1. Create an account at mongodb.com/atlas and a free **M0** cluster.
2. Database Access > Add New Database User. Use a **new** password (letters and numbers only avoids URL problems).
3. Network Access > Add IP Address > **Allow access from anywhere** (`0.0.0.0/0`). Vercel has no fixed IP.
4. Connect > Drivers > copy the string. It looks like
   `mongodb+srv://DB_USER:DB_PASSWORD@cluster0.xxxxx.mongodb.net/an-adaptive-planning?retryWrites=true&w=majority`
   Put the database name (`an-adaptive-planning`) before the `?`, and replace `DB_USER` / `DB_PASSWORD`.

## Step 2. Check it locally first
```
copy .env.example backend\.env        (Mac/Linux: cp .env.example backend/.env)
```
Fill `MONGO_URI` and `JWT_SECRET` (any long random text) in `backend/.env`, then
```
npm install
npm run seed
npm run dev
```
Open http://localhost:5173 and sign in. If this works, the deploy will work.

## Step 3. Put the code on GitHub
```
git init
git add .
git commit -m "An Adaptive Planning System"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```
Before you push, run `git status` and make sure **no `.env` file is listed** (only `.env.example` may be). `.env` is already in `.gitignore`.

## Step 4. Import into Vercel
1. vercel.com > Add New > Project > import the GitHub repo.
2. **Root Directory: leave it as the repo root** (do not pick `frontend`).
3. Framework Preset: **Other**. The build settings come from `vercel.json`
   (install `npm install`, build `npm run build --workspace frontend`, output `frontend/dist`). Do not change them.
4. Environment Variables (Production, Preview and Development):

   | Name | Value |
   |---|---|
   | `MONGO_URI` | your Atlas string from step 1 |
   | `JWT_SECRET` | a long random text (at least 32 characters) |
   | `JWT_EXPIRES` | `7d` |

5. Deploy. If the build says the Node version is too old, open Settings > General > Node.js Version and choose **22.x**, then redeploy.

## Step 5. Put the demo data in the online database (once)
The seed script runs on your computer but writes to Atlas (it uses the `MONGO_URI` in `backend/.env`). Choose a strong admin password first:
```
# Windows PowerShell
$env:ADMIN_PASSWORD="choose-a-strong-password"; npm run seed
# Mac / Linux
ADMIN_PASSWORD="choose-a-strong-password" npm run seed
```
This creates the 14 packages in their groups, the demo accounts, a waiting provider, two waiting packages and four sample bookings with payments.
The demo client and provider accounts keep the simple passwords from the table in README.md. For a real public site, change them or delete those users in Atlas.

## Step 6. Check the live site
1. `https://YOUR-APP.vercel.app/api/health` shows `{"ok":true}`.
2. `https://YOUR-APP.vercel.app/api/public/packages` shows packages (JSON).
3. Open the site, sign in as admin and look at Packages, Providers, Bookings and Payments.

## When something fails
| What you see | Reason and fix |
|---|---|
| Build fails: `vite: not found` or module errors | Root Directory is not the repo root, or the install command was changed. Reset both to the `vercel.json` values. |
| `/api/health` returns 404 | Root Directory was set to `frontend`, so `api/` and `vercel.json` were not used. Set it to the repo root. |
| `Server is missing MONGO_URI or JWT_SECRET` | Add the variables in Settings > Environment Variables, then **Redeploy** (variables only apply to new deployments). |
| `/api/health` is fine but other calls give 500 | Atlas rejected the connection: wrong password, wrong database user, or Network Access does not allow `0.0.0.0/0`. See the function log in Vercel > Deployments > Functions/Logs. |
| Marketplace is empty | The seed was not run on the online database. Do step 5. |
| Password contains `@ : / ? #` | Replace the special characters or URL-encode them in the connection string (`@` = `%40`). |

## Money
bKash and Nagad here are a **sandbox**: the flow, transaction IDs and slips work, but no real money moves. See the Payments section of README.md for what to replace to go live.
