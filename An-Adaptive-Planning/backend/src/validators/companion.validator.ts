import type { Rules } from '../middlewares/validate.js'

export const chat: Rules = { message: { required: true } }
