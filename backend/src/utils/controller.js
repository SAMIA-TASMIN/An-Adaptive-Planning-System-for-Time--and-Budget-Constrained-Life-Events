import { asyncHandler } from './asyncHandler.js'
import { created, ok } from './response.js'
// Builds a whole controller in one line: reply(message, (req) => service call).
// Every controller is the same shape, so there is nothing to repeat.
export const reply = (message, run) => asyncHandler(async (req, res) => ok(res, message, await run(req)))
export const replyCreated = (message, run) => asyncHandler(async (req, res) => created(res, message, await run(req)))
