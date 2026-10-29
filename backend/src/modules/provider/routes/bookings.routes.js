import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/booking.validator.js'
import * as c from '../controllers/bookings.controller.js'
const r = Router()
r.get('/', c.list)
r.patch('/:id/status', validate(v.status), c.setStatus)
export default r
