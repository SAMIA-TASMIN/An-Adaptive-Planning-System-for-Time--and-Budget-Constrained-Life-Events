import { HydratedDocument, Model, Schema, Types, model } from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import Package from './package.model.js'

export type BookingStatus = 'requested' | 'accepted' | 'in_progress' | 'delivered' | 'declined'
const NEXT: Record<BookingStatus, BookingStatus[]> = {
  requested: ['accepted', 'declined'], accepted: ['in_progress'], in_progress: ['delivered'], delivered: [], declined: [],
}

export interface IBooking {
  client: Types.ObjectId
  provider: Types.ObjectId
  package: Types.ObjectId
  event?: Types.ObjectId
  price?: number
  note?: string
  status: BookingStatus
  progress: number
}
interface IBookingMethods { moveTo(next: string): Promise<BookingDoc> }
interface BookingModel extends Model<IBooking, object, IBookingMethods> {
  request(clientId: string, data: { package?: unknown; event?: unknown; note?: unknown }): Promise<BookingDoc>
}
export type BookingDoc = HydratedDocument<IBooking, IBookingMethods>

const schema = new Schema<IBooking, BookingModel, IBookingMethods>({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  price: Number,
  note: String,
  status: { type: String, enum: Object.keys(NEXT), default: 'requested' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
}, { timestamps: true })

// A client can only hire an approved, active package. The rule lives here, not in the service.
schema.statics.request = async function request(this: BookingModel, clientId: string, { package: packageId, event, note }: { package?: unknown; event?: unknown; note?: unknown }) {
  const pkg = await Package.findOne({ _id: packageId, ...Package.publicFilter() })
  if (!pkg) throw new ApiError(HTTP.NOT_FOUND, MSG.NOT_FOUND)
  return this.create({ client: clientId, provider: pkg.provider, package: pkg._id, event, note, price: pkg.price })
}

// The only way a booking changes status, so the rules are in one place.
schema.methods.moveTo = function moveTo(this: BookingDoc, next: string) {
  if (!NEXT[this.status].includes(next as BookingStatus)) throw new ApiError(HTTP.CONFLICT, MSG.BAD_STATUS)
  this.status = next as BookingStatus
  if (next === 'delivered') this.progress = 100
  return this.save()
}

export default model<IBooking, BookingModel>('Booking', schema)
