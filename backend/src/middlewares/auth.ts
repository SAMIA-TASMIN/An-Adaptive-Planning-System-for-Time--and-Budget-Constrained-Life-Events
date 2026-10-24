import type { NextFunction, Request, Response } from 'express'
import User, { type Role } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import { verifyToken } from '../utils/token.js'

// Reads "Authorization: Bearer <token>" and puts the user on req.user.
export const protect = asyncHandler(async (req, _res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) throw new ApiError(HTTP.UNAUTHORIZED, MSG.NO_TOKEN)
  let decoded: { id: string }
  try { decoded = verifyToken(token) } catch { throw new ApiError(HTTP.UNAUTHORIZED, MSG.BAD_TOKEN) }
  const user = await User.findById(decoded.id)
  if (!user) throw new ApiError(HTTP.UNAUTHORIZED, MSG.BAD_TOKEN)
  req.user = user
  next()
})

// allow('client'), allow('provider', 'admin') ...
export const allow = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) =>
  req.user && roles.includes(req.user.role) ? next() : next(new ApiError(HTTP.FORBIDDEN, MSG.FORBIDDEN))
