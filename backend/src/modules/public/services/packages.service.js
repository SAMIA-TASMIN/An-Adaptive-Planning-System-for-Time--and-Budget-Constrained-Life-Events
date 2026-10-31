import Package from '../../../models/package.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(Package, { path: 'provider', select: 'name' })
// ?event=Wedding (or the older ?category=...). Only packages a client may hire are returned.
const pickEvent = (q) => (typeof q.event === 'string' ? q.event : typeof q.category === 'string' ? q.category : undefined)
export default {
  list: async (query) => base.list(await Package.publicFilter(pickEvent(query)), query),
  get: async (id) => base.get(id, await Package.publicFilter()),
}
