import express from 'express'
import cors from 'cors'
import { CLIENT_URL } from './config/env.js'
import routes from './routes/index.js'
import { limiter } from './middlewares/rateLimiter.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(cors({ origin: CLIENT_URL })) // CORS policy
app.use(express.json()) // JSON body porar jonno
app.use(limiter) // rate limiting

app.get('/', (req, res) => res.json({ message: 'API is running' }))
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app