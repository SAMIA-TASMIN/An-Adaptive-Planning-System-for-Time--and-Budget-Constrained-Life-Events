import type { Request } from 'express'
import type { UserDoc } from '../models/user.model.js'
import { asyncHandler } from './asyncHandler.js'
import { created, ok } from './response.js'

// A request that has already passed the login check, so req.user is always there.
export type AuthedRequest = Request & { user: UserDoc }
type Run = (req: AuthedRequest) => unknown

// Builds a whole controller in one line: reply(message, (req) => service call).
// Every controller is the same shape, so there is nothing to repeat.
export const reply = (message: string, run: Run) => asyncHandler(async (req, res) => ok(res, message, await run(req as AuthedRequest)))
export const replyCreated = (message: string, run: Run) => asyncHandler(async (req, res) => created(res, message, await run(req as AuthedRequest)))
