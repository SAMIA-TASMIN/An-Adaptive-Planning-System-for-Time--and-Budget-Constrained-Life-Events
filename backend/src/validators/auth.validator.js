export const register = { name: { required: true }, email: { required: true, type: 'email' }, password: { required: true, minLength: 6 } }
export const login = { email: { required: true, type: 'email' }, password: { required: true } }
