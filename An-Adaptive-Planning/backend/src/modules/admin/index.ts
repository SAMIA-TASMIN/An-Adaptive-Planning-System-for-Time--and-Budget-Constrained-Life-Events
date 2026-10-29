import { Router } from 'express'
import { protect, allow } from '../../middlewares/auth.js'
import overview from './routes/overview.routes.js'
import plans from './routes/plans.routes.js'
import providers from './routes/providers.routes.js'

const r = Router()
r.use(protect, allow('admin'))
r.use('/overview', overview)
r.use('/plans', plans)
r.use('/providers', providers)
export default r
