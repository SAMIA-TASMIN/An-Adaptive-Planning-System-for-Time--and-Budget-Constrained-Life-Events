import ApiError from './ApiError.js'
import { HTTP } from './httpStatus.js'
import { MSG } from './messages.js'
import { paginate } from './paginate.js'
import { pick } from './pick.js'
// One generic list/get/create/update/remove for any model. Every service reuses it (DRY).
export const crud = (Model, populate) => {
  const get = async (id, filter = {}) => {
    const q = Model.findOne({ _id: id, ...filter })
    if (populate) q.populate(populate)
    const doc = await q
    if (!doc) throw new ApiError(HTTP.NOT_FOUND, MSG.NOT_FOUND)
    return doc
  }
  return {
    async list(filter = {}, query = {}) {
      const { page, limit, skip } = paginate(query)
      const q = Model.find(filter).sort('-createdAt').skip(skip).limit(limit)
      if (populate) q.populate(populate)
      const [items, total] = await Promise.all([q, Model.countDocuments(filter)])
      return { items, total, page, limit }
    },
    get,
    create: (data) => Model.create(data),
    async update(id, filter, data) {
      const doc = await get(id, filter)
      doc.set(data)
      return doc.save()
    },
    async remove(id, filter) {
      const doc = await get(id, filter)
      await doc.deleteOne()
      return doc
    },
  }
}
// The same CRUD, but every call is limited to one owner (for example only this client's events).
// Services use this instead of repeating "{ owner: userId }" everywhere.
export const owned = (Model, field, populate) => {
  const base = crud(Model, populate)
  const scope = (ownerId) => ({ [field]: ownerId })
  return {
    list: (ownerId, query, extra = {}) => base.list({ ...scope(ownerId), ...extra }, query),
    get: (ownerId, id) => base.get(id, scope(ownerId)),
    create: (ownerId, data, fields, extra = {}) => base.create({ ...pick(data, fields), ...extra, ...scope(ownerId) }),
    update: (ownerId, id, data, fields) => base.update(id, scope(ownerId), pick(data, fields)),
    remove: (ownerId, id) => base.remove(id, scope(ownerId)),
  }
}
