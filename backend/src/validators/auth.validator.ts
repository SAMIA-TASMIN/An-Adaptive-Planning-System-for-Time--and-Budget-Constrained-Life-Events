import type { Rules } from '../middlewares/validate.js'

export const register: Rules = { name: { required: true }, email: { required: true, type: 'email' }, password: { required: true, minLength: 6 } }
export const login: Rules = { email: { required: true, type: 'email' }, password: { required: true } }
