import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler, notFound } from './middlewares/error.js'
import routes from './routes.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api', routes)
app.use(notFound)
app.use(errorHandler)

export default app
