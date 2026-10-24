import Plan from '../../../models/plan.model.js'
import { crud, type Query } from '../../../utils/crud.js'

const base = crud(Plan, 'event')

export default {
  list: (query: Query) => base.list(query.status ? { approvalStatus: query.status } : {}, query),
  get: (id: string) => base.get(id),
  async decide(id: string, approved: boolean, comment?: string) { return (await base.get(id)).decide(approved, comment) },
}
