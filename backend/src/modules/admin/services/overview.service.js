import Event from '../../../models/event.model.js'
import Plan from '../../../models/plan.model.js'
import Review from '../../../models/review.model.js'
export default {
  async get() {
    const [requestsWaiting, plansToApprove, eventsInProgress, averageRating] = await Promise.all([
      Event.countDocuments({ status: 'submitted' }),
      Plan.countDocuments({ approvalStatus: { $in: ['pending', 'generated'] } }),
      Event.countDocuments({ status: { $in: ['in_review', 'planned', 'approved'] } }),
      Review.average(),
    ])
    return { requestsWaiting, plansToApprove, eventsInProgress, averageRating }
  },
}
