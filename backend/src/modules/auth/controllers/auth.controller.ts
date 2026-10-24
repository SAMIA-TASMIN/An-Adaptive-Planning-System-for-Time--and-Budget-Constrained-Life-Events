import { reply, replyCreated } from '../../../utils/controller.js'
import { MSG } from '../../../utils/messages.js'
import service from '../services/auth.service.js'

export const register = replyCreated(MSG.REGISTERED, (req) => service.register(req.body))
export const login = reply(MSG.LOGGED_IN, (req) => service.login(req.body))
export const me = reply(MSG.FETCHED, (req) => req.user.toPublic())
