import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import { send } from '../utils/response.js'

type AppError = Error & { statusCode?: number; code?: number; errors?: Record<string, { message: string }> }

export const notFound = (req: Request, res: Response) => send(res, HTTP.NOT_FOUND, `${MSG.NOT_FOUND}: ${req.method} ${req.originalUrl}`)

// One place that turns every error into a clean JSON reply.
export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction) => {
  if (err.name === 'ValidationError') return send(res, HTTP.BAD_REQUEST, Object.values(err.errors ?? {}).map((e) => e.message).join(', '))
  if (err.name === 'CastError') return send(res, HTTP.BAD_REQUEST, 'Invalid id')
  if (err.code === 11000) return send(res, HTTP.CONFLICT, 'Already exists')
  const status = err.statusCode || HTTP.SERVER
  if (status === HTTP.SERVER && env.NODE_ENV !== 'production') console.error(err)
  return send(res, status, status === HTTP.SERVER ? MSG.SERVER : err.message)
}
