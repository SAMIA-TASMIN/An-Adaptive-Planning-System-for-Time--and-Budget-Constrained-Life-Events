import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/bookings.service.js'
export const list = reply(MSG.FETCHED, (req) => service.list(req.query))
export const counts = reply(MSG.FETCHED, () => service.counts())
export const get = reply(MSG.FETCHED, (req) => service.get(req.params.id))
export const refund = reply(MSG.REFUNDED, (req) => service.refund(req.params.id, req.body.note))
