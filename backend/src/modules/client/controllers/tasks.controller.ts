import { reply, replyCreated } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/tasks.service.js'

export const list = reply(MSG.FETCHED, (req) => service.list(req.user.id, req.params.eventId, req.query))
export const create = replyCreated(MSG.CREATED, (req) => service.create(req.user.id, req.params.eventId, req.body))
export const update = reply(MSG.UPDATED, (req) => service.update(req.user.id, req.params.eventId, req.params.id, req.body))
export const remove = reply(MSG.DELETED, (req) => service.remove(req.user.id, req.params.eventId, req.params.id))
