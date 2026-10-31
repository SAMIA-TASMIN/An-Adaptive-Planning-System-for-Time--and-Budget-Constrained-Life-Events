import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as c from '../controllers/providers.controller.js'
const r = Router()
r.get('/', c.list)
r.get('/counts', c.counts) // must stay above '/:id'
// body: { status: 'active' | 'rejected' | 'suspended', comment } (a reason is required for rejected and suspended)
r.patch('/:id/status', validate({ status: { required: true, oneOf: ['active', 'rejected', 'suspended'] } }), c.setStatus)
export default r
