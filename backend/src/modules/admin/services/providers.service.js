import User from '../../../models/user.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(User)
export default {
  list: (query) => base.list({ role: 'provider' }, query),
  async setStatus(id, status) {
    return (await base.get(id, { role: 'provider' })).changeStatus(status)
  },
}
