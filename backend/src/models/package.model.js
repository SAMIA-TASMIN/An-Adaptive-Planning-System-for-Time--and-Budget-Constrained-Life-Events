import { Schema, model } from 'mongoose'
const schema = new Schema(
  {
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Birthday', 'Farewell', 'Other', 'Parties', 'Moving', 'Trips'], default: 'Other' },
    price: { type: Number, required: true, min: 0 },
    duration: String,
    description: String,
    image: String,
    status: { type: String, enum: ['pending', 'approved', 'suspended', 'rejected'], default: 'pending' },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true },
)
// Marketplace filter. Birthday and Farewell each show only their own packages;
// "Other" shows every remaining event (weddings, proposals, trips, moving, decor ...) together.
export const CATEGORIES = ['All', 'Birthday', 'Farewell', 'Other']
const categoryFilter = (category) => {
  if (category === 'Other') return { category: { $nin: ['Birthday', 'Farewell'] } }
  return category && category !== 'All' ? { category } : {}
}
schema.statics.publicFilter = (category) => ({ status: 'approved', isActive: true, ...categoryFilter(category) })
export default model('Package', schema)
