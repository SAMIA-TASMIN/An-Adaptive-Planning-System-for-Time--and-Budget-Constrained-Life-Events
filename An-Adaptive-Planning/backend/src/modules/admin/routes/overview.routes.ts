import { Router } from 'express'
import * as c from '../controllers/overview.controller.js'

const r = Router()
r.get('/', c.get)
export default r
