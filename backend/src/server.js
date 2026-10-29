import app from './app.js'
import connectDB from './config/db.js'
import { env } from './config/env.js'
if (!env.MONGO_URI || !env.JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env and fill it in.')
  process.exit(1)
}
await connectDB()
app.listen(env.PORT, () => console.log(`An Adaptive Planning API on http://localhost:${env.PORT}`))
