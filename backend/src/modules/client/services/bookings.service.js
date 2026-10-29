import Booking from '../../../models/booking.model.js'
import { owned } from '../../../utils/crud.js'

const mine = owned(Booking, 'client', [
  { path: 'package', select: 'title image' },
  { path: 'provider', select: 'name' },
])

export default {
  list: mine.list,
  create: (userId, data) => Booking.request(userId, data),
  async pay(userId, id, data) {
    const booking = await mine.get(userId, id)
    await booking.pay(data) // the model checks every payment rule
    return booking.populate(['package', 'provider'])
  },
}
