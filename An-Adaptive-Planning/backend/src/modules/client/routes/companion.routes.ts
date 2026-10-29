import { Router } from 'express'
import { validate } from '../../../middlewares/validate.js'
import * as v from '../../../validators/companion.validator.js'
import * as c from '../controllers/companion.controller.js'

const r = Router()
r.post('/', validate(v.chat), c.chat)
export default r
