import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middlewares/error.js'
import routes from './routes.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true }))

// Connect to MongoDB before any other API route (needed on Vercel, harmless locally).
app.use(async (_req, _res, next) => {
  try { await connectDB(); next() } catch (e) { next(e) }
})

app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

export default app
