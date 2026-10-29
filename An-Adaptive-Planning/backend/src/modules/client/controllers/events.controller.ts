import { reply, replyCreated } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/events.service.js'

export const list = reply(MSG.FETCHED, (req) => service.list(req.user.id, req.query))
export const get = reply(MSG.FETCHED, (req) => service.get(req.user.id, req.params.id))
export const create = replyCreated(MSG.CREATED, (req) => service.create(req.user.id, req.body))
export const update = reply(MSG.UPDATED, (req) => service.update(req.user.id, req.params.id, req.body))
export const submit = reply(MSG.SUBMITTED, (req) => service.submit(req.user.id, req.params.id))
export const plan = reply(MSG.FETCHED, (req) => service.plan(req.user.id, req.params.id))
