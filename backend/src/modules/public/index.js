import { Router } from 'express'
import packages from './routes/packages.routes.js'
import stats from './routes/stats.routes.js'
const r = Router() // no login needed
r.use('/packages', packages)
r.use('/stats', stats)
export default r
