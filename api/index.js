// Vercel entry point: every /api/* request is rewritten to this function (see vercel.json).
// The Express app (backend/src/app.js) connects to MongoDB itself and is the same one `npm run dev` starts.
import app from '../backend/src/app.js'
import { env } from '../backend/src/config/env.js'

export default function handler(req, res) {
  if (!env.MONGO_URI || !env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'Server is missing MONGO_URI or JWT_SECRET (set them in Vercel > Settings > Environment Variables).' })
  }
  return app(req, res)
}
