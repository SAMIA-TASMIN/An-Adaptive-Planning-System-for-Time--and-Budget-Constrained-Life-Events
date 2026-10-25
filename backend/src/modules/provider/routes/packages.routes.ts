import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/package.validator.js'
import * as c from '../controllers/packages.controller.js'

const r = Router()
r.route('/').get(c.list).post(validate(v.create), c.create)
r.route('/:id').patch(c.update).delete(c.remove)
export default r
