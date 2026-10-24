import { Router } from 'express'
import { protect } from '../../../middlewares/auth.js'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/auth.validator.js'
import * as c from '../controllers/auth.controller.js'

const r = Router()
r.post('/register', validate(v.register), c.register)
r.post('/login', validate(v.login), c.login)
r.get('/me', protect, c.me)
export default r
