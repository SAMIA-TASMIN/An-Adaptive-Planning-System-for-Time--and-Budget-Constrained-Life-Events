import Event from '../../../models/event.model.js'
import Review from '../../../models/review.model.js'
import User from '../../../models/user.model.js'
export default {
  async get() {
    const [eventsPlanned, verifiedProviders, averageRating] = await Promise.all([
      Event.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'provider', status: 'active' }),
      Review.average(),
    ])
    return { eventsPlanned, verifiedProviders, averageRating }
  },
}
