import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/bookings.service.js'
export const list = reply(MSG.FETCHED, (req) => service.list(req.user.id, req.query))
export const setStatus = reply(MSG.UPDATED, (req) => service.setStatus(req.user.id, req.params.id, req.body.status, req.body.progress))
