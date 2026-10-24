import type { RequestHandler } from 'express'
import ApiError from '../utils/ApiError.js'
import { HTTP } from '../utils/httpStatus.js'

export interface Rule { required?: boolean; type?: 'email' | 'number'; minLength?: number; oneOf?: readonly string[] }
export type Rules = Record<string, Rule>

type Check = (field: string, value: unknown, rule: Rule) => string | false | undefined | 0
const CHECKS: Check[] = [
  (f, v, r) => r.type === 'email' && !/^\S+@\S+\.\S+$/.test(String(v)) && `${f} must be a valid email`,
  (f, v, r) => r.type === 'number' && Number.isNaN(Number(v)) && `${f} must be a number`,
  (f, v, r) => !!r.minLength && String(v).length < r.minLength && `${f} must be at least ${r.minLength} characters`,
  (f, v, r) => !!r.oneOf && !r.oneOf.includes(String(v)) && `${f} must be one of: ${r.oneOf.join(', ')}`,
]

// validate({ field: { required, type, minLength, oneOf } }) checks req.body before the controller runs.
export const validate = (rules: Rules): RequestHandler => (req, _res, next) => {
  const errors: string[] = []
  for (const [field, rule] of Object.entries(rules)) {
    const v: unknown = req.body?.[field]
    if (v === undefined || v === null || v === '') { if (rule.required) errors.push(`${field} is required`); continue }
    errors.push(...CHECKS.map((check) => check(field, v, rule)).filter((m): m is string => typeof m === 'string'))
  }
  return errors.length ? next(new ApiError(HTTP.BAD_REQUEST, errors.join(', '))) : next()
}
