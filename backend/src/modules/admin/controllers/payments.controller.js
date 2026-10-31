import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/payments.service.js'
export const list = reply(MSG.FETCHED, (req) => service.list(req.query))
export const summary = reply(MSG.FETCHED, () => service.summary())
