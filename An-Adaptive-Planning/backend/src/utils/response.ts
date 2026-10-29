import type { Response } from 'express'
import { HTTP } from './httpStatus.js'

export const send = (res: Response, status: number, message: string, data: unknown = null) =>
  res.status(status).json({ success: status < 400, message, data })
export const ok = (res: Response, message: string, data?: unknown) => send(res, HTTP.OK, message, data)
export const created = (res: Response, message: string, data?: unknown) => send(res, HTTP.CREATED, message, data)
