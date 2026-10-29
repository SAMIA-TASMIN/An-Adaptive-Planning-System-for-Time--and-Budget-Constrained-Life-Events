import Package from '../../../models/package.model.js'
import { owned, type Filter } from '../../../utils/crud.js'

const mine = owned(Package, 'provider')
const FIELDS = ['title', 'category', 'price', 'duration', 'description', 'image', 'isActive']

export default {
  list: mine.list,
  create: (providerId: string, data: Filter) => mine.create(providerId, data, FIELDS, { status: 'pending' }), // an admin must approve it
  update: (providerId: string, id: string, data: Filter) => mine.update(providerId, id, data, FIELDS),
  remove: mine.remove,
}
