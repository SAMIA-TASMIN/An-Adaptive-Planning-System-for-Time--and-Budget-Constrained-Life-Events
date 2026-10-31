import Event from '../../../models/event.model.js'
import Package from '../../../models/package.model.js'
import Plan from '../../../models/plan.model.js'
import Review from '../../../models/review.model.js'
import User from '../../../models/user.model.js'
import payments from './payments.service.js'
export default {
  async get() {
    const [requestsWaiting, plansToApprove, eventsInProgress, averageRating, packagesToApprove, providersToApprove, money] = await Promise.all([
      Event.countDocuments({ status: 'submitted' }),
      Plan.countDocuments({ approvalStatus: { $in: ['pending', 'generated'] } }),
      Event.countDocuments({ status: { $in: ['in_review', 'planned', 'approved'] } }),
      Review.average(),
      Package.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'provider', status: 'pending' }),
      payments.summary(),
    ])
    return { requestsWaiting, plansToApprove, eventsInProgress, averageRating, packagesToApprove, providersToApprove, money }
  },
}
