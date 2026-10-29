import { Schema, model } from 'mongoose'
const schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User' },
    package: { type: Schema.Types.ObjectId, ref: 'Package' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true },
)
schema.statics.average = async function average() {
  const [row] = await this.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
  return row ? Math.round(row.avg * 10) / 10 : 0
}
export default model('Review', schema)
