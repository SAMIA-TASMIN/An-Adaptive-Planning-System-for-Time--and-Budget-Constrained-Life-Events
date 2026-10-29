import Event from '../../../models/event.model.js'
import Plan from '../../../models/plan.model.js'
import { owned, type Filter } from '../../../utils/crud.js'
import { buildPlan } from '../../../utils/planner.js'

const mine = owned(Event, 'owner')
const FIELDS = ['title', 'type', 'deadline', 'budget', 'guests', 'notes']

export default {
  list: mine.list,
  get: mine.get,
  create: (userId: string, data: Filter) => mine.create(userId, data, FIELDS),
  update: (userId: string, id: string, data: Filter) => mine.update(userId, id, data, FIELDS),
  // Sending an event for review also creates the first draft of its plan, so the admin has something to approve.
  async submit(userId: string, id: string) {
    const event = await (await mine.get(userId, id)).submitForReview()
    await Plan.create({ event: event._id, ...buildPlan(event) })
    return event
  },
  // A client only sees the plan once the admin has approved it.
  async plan(userId: string, id: string) {
    const event = await mine.get(userId, id)
    const plan = await Plan.findOne({ event: event._id })
    if (!plan) return null
    if (plan.approvalStatus !== 'approved') return { approvalStatus: plan.approvalStatus, adminComment: plan.adminComment }
    return plan
  },
}
