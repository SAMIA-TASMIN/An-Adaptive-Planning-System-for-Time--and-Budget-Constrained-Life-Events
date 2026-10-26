import type { Model, PopulateOptions } from 'mongoose'
import ApiError from './ApiError.js'
import { HTTP } from './httpStatus.js'
import { MSG } from './messages.js'
import { paginate } from './paginate.js'
import { pick } from './pick.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModel = Model<any, any, any, any>
type Populate = string | PopulateOptions | (string | PopulateOptions)[]
export type Filter = Record<string, unknown>
export type Query = Record<string, unknown>

// One generic list/get/create/update/remove for any model. Every service reuses it (DRY).
export const crud = (Model: AnyModel, populate?: Populate) => {
  const get = async (id: string, filter: Filter = {}) => {
    const q = Model.findOne({ _id: id, ...filter })
    if (populate) q.populate(populate)
    const doc = await q
    if (!doc) throw new ApiError(HTTP.NOT_FOUND, MSG.NOT_FOUND)
    return doc
  }
  return {
    async list(filter: Filter = {}, query: Query = {}) {
      const { page, limit, skip } = paginate(query)
      const q = Model.find(filter).sort('-createdAt').skip(skip).limit(limit)
      if (populate) q.populate(populate)
      const [items, total] = await Promise.all([q, Model.countDocuments(filter)])
      return { items, total, page, limit }
    },
    get,
    create: (data: Filter) => Model.create(data),
    async update(id: string, filter: Filter, data: Filter) {
      const doc = await get(id, filter)
      doc.set(data)
      return doc.save()
    },
    async remove(id: string, filter: Filter) {
      const doc = await get(id, filter)
      await doc.deleteOne()
      return doc
    },
  }
}

// The same CRUD, but every call is limited to one owner (for example only this client's events).
// Services use this instead of repeating "{ owner: userId }" everywhere.
export const owned = (Model: AnyModel, field: string, populate?: Populate) => {
  const base = crud(Model, populate)
  const scope = (ownerId: string): Filter => ({ [field]: ownerId })
  return {
    list: (ownerId: string, query: Query, extra: Filter = {}) => base.list({ ...scope(ownerId), ...extra }, query),
    get: (ownerId: string, id: string) => base.get(id, scope(ownerId)),
    create: (ownerId: string, data: Filter, fields: string[], extra: Filter = {}) => base.create({ ...pick(data, fields), ...extra, ...scope(ownerId) }),
    update: (ownerId: string, id: string, data: Filter, fields: string[]) => base.update(id, scope(ownerId), pick(data, fields)),
    remove: (ownerId: string, id: string) => base.remove(id, scope(ownerId)),
  }
}
