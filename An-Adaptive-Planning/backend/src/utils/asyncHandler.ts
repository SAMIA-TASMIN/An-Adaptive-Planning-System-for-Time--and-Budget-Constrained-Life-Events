import type { NextFunction, Request, RequestHandler, Response } from 'express'

// Wraps a controller so any error goes to the error middleware (no try/catch in controllers).
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => { Promise.resolve(fn(req, res, next)).catch(next) }
