import { reply, replyCreated } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/stats.service.js'

export const get = reply(MSG.FETCHED, () => service.get())
