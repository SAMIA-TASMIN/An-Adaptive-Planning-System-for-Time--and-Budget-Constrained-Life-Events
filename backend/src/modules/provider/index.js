import { Router } from 'express'
import { protect, allow } from '../../middlewares/auth.js'
import packages from './routes/packages.routes.js'
import bookings from './routes/bookings.routes.js'
const r = Router()
r.use(protect, allow('provider'))
r.use('/packages', packages)
r.use('/bookings', bookings)
export default r
