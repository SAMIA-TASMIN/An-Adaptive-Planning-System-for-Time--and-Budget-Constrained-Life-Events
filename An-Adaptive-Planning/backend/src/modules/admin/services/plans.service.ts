import Plan from '../../../models/plan.model.js'
import { crud, type Query } from '../../../utils/crud.js'

const base = crud(Plan, 'event')

export default {
  list: (query: Query) => base.list(query.status ? { approvalStatus: query.status } : {}, query),
  get: (id: string) => base.get(id),
  async decide(id: string, approved: boolean, comment?: string) { return (await base.get(id)).decide(approved, comment) },
  // How many plans are in each queue, for the tabs on the approvals page.
  async counts() {
    const rows = await Plan.aggregate<{ _id: string; n: number }>([{ $group: { _id: '$approvalStatus', n: { $sum: 1 } } }])
    return Object.fromEntries(rows.map((r) => [r._id, r.n]))
  },
}
