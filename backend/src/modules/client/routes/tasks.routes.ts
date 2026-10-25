import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/task.validator.js'
import * as c from '../controllers/tasks.controller.js'

const r = Router({ mergeParams: true }) // keeps :eventId from the parent route
r.route('/').get(c.list).post(validate(v.create), c.create)
r.route('/:id').patch(c.update).delete(c.remove)
export default r
