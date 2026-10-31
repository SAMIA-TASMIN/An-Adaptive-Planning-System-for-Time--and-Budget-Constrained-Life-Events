import { Router } from 'express'
import * as c from '../controllers/packages.controller.js'
const r = Router()
r.get('/', c.list)
r.get('/counts', c.counts) // must stay above '/:id'
r.get('/:id', c.get)
r.post('/:id/approve', c.approve)
r.post('/:id/reject', c.reject) // body: { comment } (the reason is required)
r.post('/:id/suspend', c.suspend) // a live package taken down, body: { comment }
export default r
