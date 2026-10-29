import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/plans.service.js'
export const list = reply(MSG.FETCHED, (req) => service.list(req.query))
export const counts = reply(MSG.FETCHED, () => service.counts())
export const get = reply(MSG.FETCHED, (req) => service.get(req.params.id))
export const approve = reply(MSG.APPROVED, (req) => service.decide(req.params.id, true, req.body.comment))
export const reject = reply(MSG.REJECTED, (req) => service.decide(req.params.id, false, req.body.comment))
