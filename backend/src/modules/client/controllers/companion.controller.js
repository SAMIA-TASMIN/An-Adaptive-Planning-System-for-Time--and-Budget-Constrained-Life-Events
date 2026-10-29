import { reply } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/companion.service.js'
export const chat = reply(MSG.FETCHED, (req) => service.chat(String(req.body.message), req.body.draft))
