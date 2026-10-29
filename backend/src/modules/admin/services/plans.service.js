import Plan from '../../../models/plan.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(Plan, 'event')
export default {
  list: (query) => base.list(query.status ? { approvalStatus: query.status } : {}, query),
  get: (id) => base.get(id),
  async decide(id, approved, comment) {
    return (await base.get(id)).decide(approved, comment)
  },
  // How many plans are in each queue, for the tabs on the approvals page.
  async counts() {
    const rows = await Plan.aggregate([{ $group: { _id: '$approvalStatus', n: { $sum: 1 } } }])
    return Object.fromEntries(rows.map((r) => [r._id, r.n]))
  },
}
