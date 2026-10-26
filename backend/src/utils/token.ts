import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'

export const signToken = (id: string): string =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES as SignOptions['expiresIn'] })
export const verifyToken = (token: string): { id: string } => jwt.verify(token, env.JWT_SECRET) as { id: string }
