import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/event.validator.js'
import * as c from '../controllers/events.controller.js'
import tasks from './tasks.routes.js'

const r = Router()
r.route('/').get(c.list).post(validate(v.create), c.create)
r.route('/:id').get(c.get).patch(c.update)
r.post('/:id/submit', c.submit)
r.get('/:id/plan', c.plan)
r.use('/:eventId/tasks', tasks)
export default r
