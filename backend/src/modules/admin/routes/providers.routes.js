import { Router } from 'express'
import * as c from '../controllers/providers.controller.js'
const r = Router()
r.get('/', c.list)
r.patch('/:id/status', c.setStatus)
export default r
