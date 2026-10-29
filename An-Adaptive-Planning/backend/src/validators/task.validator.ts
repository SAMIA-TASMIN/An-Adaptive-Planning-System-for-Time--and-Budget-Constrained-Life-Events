import type { Rules } from '../middlewares/validate.js'

export const create: Rules = { title: { required: true }, priority: { oneOf: ['must', 'should', 'nice'] } }
