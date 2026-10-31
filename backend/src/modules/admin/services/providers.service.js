import Booking from '../../../models/booking.model.js'
import Package from '../../../models/package.model.js'
import User from '../../../models/user.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(User)
const byProvider = (rows) => new Map(rows.map((r) => [String(r._id), r]))
export default {
  // Each provider with how many packages they have and how much money their jobs brought in.
  async list(query) {
    const page = await base.list({ role: 'provider', ...(query.status ? { status: query.status } : {}) }, query)
    const ids = page.items.map((u) => u._id)
    const [pk, bk] = await Promise.all([
      Package.aggregate([
        { $match: { provider: { $in: ids } } },
        { $group: { _id: '$provider', total: { $sum: 1 }, live: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } },
      ]),
      Booking.aggregate([
        { $match: { provider: { $in: ids } } },
        { $group: { _id: '$provider', jobs: { $sum: 1 }, collected: { $sum: '$paid' } } },
      ]),
    ])
    const packs = byProvider(pk)
    const jobs = byProvider(bk)
    const items = page.items.map((u) => ({
      ...u.toObject(),
      packages: packs.get(String(u._id))?.total ?? 0,
      livePackages: packs.get(String(u._id))?.live ?? 0,
      jobs: jobs.get(String(u._id))?.jobs ?? 0,
      collected: jobs.get(String(u._id))?.collected ?? 0,
    }))
    return { ...page, items }
  },
  async counts() {
    const rows = await User.aggregate([{ $match: { role: 'provider' } }, { $group: { _id: '$status', n: { $sum: 1 } } }])
    return Object.fromEntries(rows.map((r) => [r._id, r.n]))
  },
  async setStatus(id, status, comment) {
    return (await base.get(id, { role: 'provider' })).changeStatus(status, comment)
  },
}
