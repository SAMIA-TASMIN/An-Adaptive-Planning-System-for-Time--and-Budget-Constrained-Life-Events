import Package from '../../../models/package.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(Package, { path: 'provider', select: 'name email status' })
export default {
  list: (query) => base.list(query.status ? { status: query.status } : {}, query),
  get: (id) => base.get(id),
  approve: async (id, comment) => (await base.get(id)).approve(comment),
  reject: async (id, comment) => (await base.get(id)).reject(comment),
  suspend: async (id, comment) => (await base.get(id)).suspend(comment),
  // How many packages are in each queue, for the tabs.
  async counts() {
    const rows = await Package.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }])
    return Object.fromEntries(rows.map((r) => [r._id, r.n]))
  },
}
