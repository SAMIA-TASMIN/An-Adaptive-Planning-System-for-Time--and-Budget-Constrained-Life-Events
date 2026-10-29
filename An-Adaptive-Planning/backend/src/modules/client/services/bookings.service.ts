import Booking from '../../../models/booking.model.js'
import { owned } from '../../../utils/crud.js'

const mine = owned(Booking, 'client', [{ path: 'package', select: 'title image' }, { path: 'provider', select: 'name' }])

export default {
  list: mine.list,
  create: (userId: string, data: Record<string, unknown>) => Booking.request(userId, data),
}
