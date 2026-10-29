import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/packages.service.js'
export const list = reply(MSG.FETCHED, (req) => service.list(req.query))
export const get = reply(MSG.FETCHED, (req) => service.get(req.params.id))
