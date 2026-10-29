import Package from '../../../models/package.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(Package, { path: 'provider', select: 'name' })
export default {
  list: (query) => base.list(Package.publicFilter(typeof query.category === 'string' ? query.category : undefined), query),
  get: (id) => base.get(id, Package.publicFilter()),
}
