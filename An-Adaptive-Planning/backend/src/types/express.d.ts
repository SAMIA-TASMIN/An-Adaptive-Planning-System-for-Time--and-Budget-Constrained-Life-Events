import type { UserDoc } from '../models/user.model.js'

// Lets middleware put the signed-in user on req.user.
declare global {
  namespace Express {
    interface Request { user?: UserDoc }
  }
}
export {}
