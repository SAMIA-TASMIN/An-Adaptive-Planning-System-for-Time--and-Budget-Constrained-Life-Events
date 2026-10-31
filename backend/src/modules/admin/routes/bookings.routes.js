import { Router } from 'express'
import * as c from '../controllers/bookings.controller.js'
const r = Router()
r.get('/', c.list)
r.get('/counts', c.counts) // must stay above '/:id'
r.get('/:id', c.get)
r.post('/:id/refund', c.refund) // body: { note } - records the refund of a declined, paid booking
export default r
