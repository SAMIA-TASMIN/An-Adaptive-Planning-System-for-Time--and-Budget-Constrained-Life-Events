import type { Rules } from '../middlewares/validate.js'

export const create: Rules = { title: { required: true }, price: { required: true, type: 'number' }, category: { oneOf: ['Parties', 'Moving', 'Trips', 'Other'] } }
