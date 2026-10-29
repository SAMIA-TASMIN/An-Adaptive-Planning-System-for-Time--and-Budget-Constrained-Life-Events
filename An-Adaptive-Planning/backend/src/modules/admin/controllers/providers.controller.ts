import { reply, replyCreated } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/providers.service.js'

export const list = reply(MSG.FETCHED, (req) => service.list(req.query))
export const setStatus = reply(MSG.UPDATED, (req) => service.setStatus(req.params.id, req.body.status))
