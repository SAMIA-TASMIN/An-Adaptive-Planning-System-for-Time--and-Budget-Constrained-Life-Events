import User from '../../../models/user.model.js'
import { crud, type Query } from '../../../utils/crud.js'

const base = crud(User)

export default {
  list: (query: Query) => base.list({ role: 'provider' }, query),
  async setStatus(id: string, status: string) { return (await base.get(id, { role: 'provider' })).changeStatus(status) },
}
