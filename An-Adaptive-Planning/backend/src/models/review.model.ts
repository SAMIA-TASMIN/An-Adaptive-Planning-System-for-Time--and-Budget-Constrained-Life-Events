import { Model, Schema, Types, model } from 'mongoose'

export interface IReview {
  author: Types.ObjectId
  provider?: Types.ObjectId
  package?: Types.ObjectId
  rating: number
  comment?: string
}
interface ReviewModel extends Model<IReview> { average(): Promise<number> }

const schema = new Schema<IReview, ReviewModel>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'User' },
  package: { type: Schema.Types.ObjectId, ref: 'Package' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
}, { timestamps: true })

schema.statics.average = async function average(this: ReviewModel) {
  const [row] = await this.aggregate<{ avg: number }>([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
  return row ? Math.round(row.avg * 10) / 10 : 0
}

export default model<IReview, ReviewModel>('Review', schema)
