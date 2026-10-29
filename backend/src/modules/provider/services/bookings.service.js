import Booking from '../../../models/booking.model.js'
import { owned } from '../../../utils/crud.js'
const mine = owned(Booking, 'provider', [
  { path: 'package', select: 'title' },
  { path: 'client', select: 'name' },
])
export default {
  list: (providerId, query) => mine.list(providerId, query, query.status ? { status: query.status } : {}),
  async setStatus(providerId, id, status, progress) {
    const booking = await mine.get(providerId, id)
    if (progress !== undefined) booking.progress = progress
    return booking.moveTo(status) // the model decides if this change is allowed
  },
}
