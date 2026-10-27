import mongoose from 'mongoose'
import { env } from './env.js'

// One shared connection. On Vercel the function can start many times, so we reuse the
// connection (or the connection attempt in progress) instead of opening a new one each time.
let pending: Promise<unknown> | null = null

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) return
  pending ??= mongoose.connect(env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((e) => { pending = null; throw e })
  await pending
}
