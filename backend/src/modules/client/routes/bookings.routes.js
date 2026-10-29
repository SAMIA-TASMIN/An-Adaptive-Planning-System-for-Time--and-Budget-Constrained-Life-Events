import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/booking.validator.js'
import * as c from '../controllers/bookings.controller.js'

const r = Router()
r.route('/').get(c.list).post(validate(v.create), c.create)
r.post('/:id/pay', validate(v.pay), c.pay)
export default r
