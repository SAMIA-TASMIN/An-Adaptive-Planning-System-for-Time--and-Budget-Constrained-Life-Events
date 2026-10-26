import type { Rules } from '../middlewares/validate.js'

export const create: Rules = { title: { required: true }, budget: { type: 'number' } }
