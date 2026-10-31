import Booking, { PAYMENT_FILTERS } from '../../../models/booking.model.js'
import { crud } from '../../../utils/crud.js'
const base = crud(Booking, [
  { path: 'client', select: 'name email' },
  { path: 'provider', select: 'name email' },
  { path: 'package', select: 'title image price' },
])
// ?status=requested|accepted|... and ?payment=unpaid|partial|paid|refund_pending|refunded
const filterOf = ({ status, payment }) => {
  const parts = []
  if (status) parts.push({ status })
  if (PAYMENT_FILTERS[payment]) parts.push(PAYMENT_FILTERS[payment])
  return parts.length ? { $and: parts } : {}
}
export default {
  list: (query) => base.list(filterOf(query), query),
  get: (id) => base.get(id),
  async refund(id, note) {
    return (await base.get(id)).markRefunded(note)
  },
  async counts() {
    const keys = Object.keys(PAYMENT_FILTERS)
    const [all, ...n] = await Promise.all([Booking.countDocuments(), ...keys.map((k) => Booking.countDocuments(PAYMENT_FILTERS[k]))])
    return { all, ...Object.fromEntries(keys.map((k, i) => [k, n[i]])) }
  },
}
