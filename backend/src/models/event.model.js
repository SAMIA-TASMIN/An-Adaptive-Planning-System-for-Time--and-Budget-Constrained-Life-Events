import { Schema, model } from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
const schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Moving', 'Party', 'Trip', 'Farewell', 'Other'], default: 'Other' },
    deadline: Date,
    budget: { type: Number, min: 0, default: 0 },
    spent: { type: Number, min: 0, default: 0 },
    guests: Number,
    notes: String,
    status: { type: String, enum: ['draft', 'submitted', 'in_review', 'planned', 'approved', 'rejected'], default: 'draft' },
  },
  { timestamps: true },
)
schema.methods.submitForReview = function submit() {
  if (this.status !== 'draft') throw new ApiError(HTTP.CONFLICT, MSG.ALREADY_SUBMITTED)
  this.status = 'submitted'
  return this.save()
}
export default model('Event', schema)
