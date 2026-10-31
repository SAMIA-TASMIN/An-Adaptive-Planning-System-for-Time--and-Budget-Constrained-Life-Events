import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/providers.service.js'
export const list = reply(MSG.FETCHED, (req) => service.list(req.query))
export const counts = reply(MSG.FETCHED, () => service.counts())
export const setStatus = reply(MSG.UPDATED, (req) => service.setStatus(req.params.id, req.body.status, req.body.comment))
