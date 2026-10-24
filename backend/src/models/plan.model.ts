import { HydratedDocument, Model, Schema, Types, model } from 'mongoose'
import Event from './event.model.js'

export type ApprovalStatus = 'pending' | 'generated' | 'approved' | 'rejected' | 'needs_replanning'

export interface IPlan {
  event: Types.ObjectId
  phases: { name?: string; tasks: string[] }[]
  budgetEstimate?: number
  companionNotes?: string
  approvalStatus: ApprovalStatus
  adminComment?: string
}
interface IPlanMethods { decide(approved: boolean, comment?: string): Promise<PlanDoc> }
type PlanModel = Model<IPlan, object, IPlanMethods>
export type PlanDoc = HydratedDocument<IPlan, IPlanMethods>

const schema = new Schema<IPlan, PlanModel, IPlanMethods>({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  phases: [{ name: String, tasks: [String] }],
  budgetEstimate: Number,
  companionNotes: String,
  approvalStatus: { type: String, enum: ['pending', 'generated', 'approved', 'rejected', 'needs_replanning'], default: 'generated' },
  adminComment: String,
}, { timestamps: true })

// Admin decisions also move the event forward, so the controller stays thin.
schema.methods.decide = async function decide(this: PlanDoc, approved: boolean, comment?: string) {
  this.approvalStatus = approved ? 'approved' : 'rejected'
  this.adminComment = comment
  await this.save()
  await Event.findByIdAndUpdate(this.event, { status: approved ? 'approved' : 'rejected' })
  return this
}

export default model<IPlan, PlanModel>('Plan', schema)
