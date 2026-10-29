import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
export const signToken = (id) => jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES })
export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET)
