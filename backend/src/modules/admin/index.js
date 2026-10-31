import { Router } from 'express'
import { protect, allow } from '../../middlewares/auth.js'
import overview from './routes/overview.routes.js'
import plans from './routes/plans.routes.js'
import packages from './routes/packages.routes.js'
import providers from './routes/providers.routes.js'
import bookings from './routes/bookings.routes.js'
import payments from './routes/payments.routes.js'
const r = Router()
r.use(protect, allow('admin'))
r.use('/overview', overview)
r.use('/plans', plans)
r.use('/packages', packages)
r.use('/providers', providers)
r.use('/bookings', bookings)
r.use('/payments', payments)
export default r
