import type { Rules } from '../middlewares/validate.js'

export const create: Rules = { package: { required: true } }
export const status: Rules = { status: { required: true, oneOf: ['accepted', 'declined', 'in_progress', 'delivered'] } }
