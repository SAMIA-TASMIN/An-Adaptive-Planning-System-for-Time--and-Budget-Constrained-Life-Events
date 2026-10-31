import { Schema, model } from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import User from './user.model.js'

// The event groups shown as chips in the Marketplace. One package can belong to more than one group.
export const EVENTS = ['Birthday', 'Farewell', 'Wedding', 'HomeDecor', 'Moving', 'Trips', 'Else']

const schema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Else' }, // the main group (used for the icon)
    events: [{ type: String, enum: EVENTS }], // every group the package appears in
    price: { type: Number, required: true, min: 0 },
    duration: String,
    description: String,
    image: String,
    status: { type: String, enum: ['pending', 'approved', 'suspended', 'rejected'], default: 'pending' },
    adminComment: String, // why the admin rejected or suspended it
    reviewedAt: Date,
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// A package with no groups goes into its main group (or "Something Else").
schema.pre('validate', function fillEvents() {
  if (!this.events?.length) this.events = [EVENTS.includes(this.category) ? this.category : 'Else']
})

const conflict = (message) => new ApiError(HTTP.CONFLICT, message)
const reason = (comment) => {
  if (!String(comment ?? '').trim()) throw new ApiError(HTTP.BAD_REQUEST, MSG.NEED_REASON)
  return String(comment).trim()
}

// Admin decisions. The rules live here so every route follows them.
schema.methods.approve = async function approve(comment = '') {
  if (this.status === 'approved') throw conflict(MSG.ALREADY_DECIDED)
  const owner = await User.findById(this.provider?._id ?? this.provider)
  if (!owner || owner.status !== 'active') throw conflict(MSG.PROVIDER_NOT_ACTIVE)
  this.set({ status: 'approved', adminComment: String(comment ?? '').trim(), reviewedAt: new Date() })
  return this.save()
}
schema.methods.reject = function reject(comment) {
  if (this.status !== 'pending') throw conflict(MSG.ALREADY_DECIDED)
  this.set({ status: 'rejected', adminComment: reason(comment), reviewedAt: new Date() })
  return this.save()
}
schema.methods.suspend = function suspend(comment) {
  if (this.status !== 'approved') throw conflict(MSG.BAD_STATUS)
  this.set({ status: 'suspended', adminComment: reason(comment), reviewedAt: new Date() })
  return this.save()
}

// What a client may see and hire: approved, switched on, from a provider the admin has approved.
// "event" is one of EVENTS (or All / nothing for every package).
schema.statics.publicFilter = async function publicFilter(event) {
  const providers = await User.find({ role: 'provider', status: 'active' }).distinct('_id')
  const filter = { status: 'approved', isActive: true, provider: { $in: providers } }
  if (event && event !== 'All') filter.events = event
  return filter
}

export default model('Package', schema)
