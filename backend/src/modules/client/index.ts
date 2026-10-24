import { Router } from 'express'
import { protect, allow } from '../../middlewares/auth.js'
import events from './routes/events.routes.js'
import bookings from './routes/bookings.routes.js'

const r = Router()
r.use(protect, allow('client')) // everything under /api/client needs a signed-in client
r.use('/events', events) // tasks live under /events/:eventId/tasks
r.use('/bookings', bookings)
export default r
