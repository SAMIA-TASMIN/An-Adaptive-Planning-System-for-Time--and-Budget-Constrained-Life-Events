import { Schema, model } from 'mongoose'
import Event from './event.model.js'
const schema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    phases: [{ name: String, tasks: [String] }],
    budgetEstimate: Number,
    companionNotes: String,
    approvalStatus: { type: String, enum: ['pending', 'generated', 'approved', 'rejected', 'needs_replanning'], default: 'generated' },
    adminComment: String,
  },
  { timestamps: true },
)
// Admin decisions also move the event forward, so the controller stays thin.
schema.methods.decide = async function decide(approved, comment) {
  this.approvalStatus = approved ? 'approved' : 'rejected'
  this.adminComment = comment
  await this.save()
  await Event.findByIdAndUpdate(this.event, { status: approved ? 'approved' : 'rejected' })
  return this
}
export default model('Plan', schema)
