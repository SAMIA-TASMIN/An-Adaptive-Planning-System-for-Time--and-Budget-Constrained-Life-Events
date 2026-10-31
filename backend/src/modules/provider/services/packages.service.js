import Package from '../../../models/package.model.js'
import { owned } from '../../../utils/crud.js'
import { pick } from '../../../utils/pick.js'
const mine = owned(Package, 'provider')
const FIELDS = ['title', 'category', 'events', 'price', 'duration', 'description', 'image', 'isActive']
// Changing any of these on a live package sends it back to the admin (a price cannot change after approval unseen).
const REVIEWED = ['title', 'category', 'events', 'price', 'duration', 'description', 'image']
export default {
  list: mine.list,
  create: (providerId, data) => mine.create(providerId, data, FIELDS, { status: 'pending' }), // an admin must approve it
  async update(providerId, id, data) {
    const doc = await mine.get(providerId, id)
    const patch = pick(data, FIELDS)
    const changed = REVIEWED.some((k) => patch[k] !== undefined && JSON.stringify(patch[k]) !== JSON.stringify(doc[k]))
    doc.set(patch)
    if (changed && doc.status !== 'pending') doc.set({ status: 'pending', adminComment: '' })
    return doc.save()
  },
  remove: mine.remove,
}
