import { Router } from 'express'
import * as c from '../controllers/payments.controller.js'
const r = Router()
r.get('/', c.list)
r.get('/summary', c.summary)
export default r
