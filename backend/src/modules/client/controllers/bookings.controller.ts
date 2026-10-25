import { reply, replyCreated } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/bookings.service.js'

export const list = reply(MSG.FETCHED, (req) => service.list(req.user.id, req.query))
export const create = replyCreated(MSG.CREATED, (req) => service.create(req.user.id, req.body))
