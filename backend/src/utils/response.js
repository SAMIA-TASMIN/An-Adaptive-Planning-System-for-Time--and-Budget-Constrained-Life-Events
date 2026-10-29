import { HTTP } from './httpStatus.js'
export const send = (res, status, message, data = null) => res.status(status).json({ success: status < 400, message, data })
export const ok = (res, message, data) => send(res, HTTP.OK, message, data)
export const created = (res, message, data) => send(res, HTTP.CREATED, message, data)
