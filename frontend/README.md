# An Adaptive Planning (frontend)

1. Open this folder in VS Code.
2. In the terminal run:  npm install
3. Then run:             npm run dev
4. Open http://localhost:5173/ - that is the only address.

Click around: Home > Marketplace / Sign in > pick a role (Client, Provider, Admin)
> use the panel tabs > Sign out. Refreshing the page returns to Home.

Structure: src/main.jsx (homepage section order + panels), src/router.js (page switching),
src/home (public sections), src/shared, src/client, src/admin, src/vendor (each has pages/).
