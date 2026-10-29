import { Router } from 'express'
import * as c from '../controllers/packages.controller.js'
const r = Router()
r.get('/', c.list)
r.get('/:id', c.get)
export default r
