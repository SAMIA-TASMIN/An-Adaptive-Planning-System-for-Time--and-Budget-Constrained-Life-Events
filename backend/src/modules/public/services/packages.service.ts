import Package from '../../../models/package.model.js'
import { crud, type Query } from '../../../utils/crud.js'

const base = crud(Package, { path: 'provider', select: 'name' })

export default {
  list: (query: Query) => base.list(Package.publicFilter(typeof query.category === 'string' ? query.category : undefined), query),
  get: (id: string) => base.get(id, Package.publicFilter()),
}
