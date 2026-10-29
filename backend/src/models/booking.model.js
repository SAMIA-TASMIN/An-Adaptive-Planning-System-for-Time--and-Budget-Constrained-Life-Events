import { Schema, model } from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { charge, receiptNumber } from '../utils/gateway.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import Package from './package.model.js'

const NEXT = {
  requested: ['accepted', 'declined'],
  accepted: ['in_progress'],
  in_progress: ['delivered'],
  delivered: [],
  declined: [],
}

export const METHODS = ['bkash', 'nagad']
export const MIN_ADVANCE_PERCENT = 20 // the first payment must be at least this much of the price
const MIN_NEXT_PAYMENT = 100 // later payments: at least this many taka (or whatever is left)

// One payment made by the client. Only the masked wallet number is kept, never a PIN or OTP.
const paymentSchema = new Schema({
  method: { type: String, enum: METHODS, required: true },
  wallet: { type: String, required: true },
  amount: { type: Number, required: true, min: 1 },
  trxId: { type: String, required: true },
  paidAt: { type: Date, default: Date.now },
})

const schema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    package: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    price: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    payments: [paymentSchema],
    receiptNo: String, // created when the booking is paid in full
    note: String,
    status: { type: String, enum: Object.keys(NEXT), default: 'requested' },
    progress: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
)

// What is still to pay, and a one-word summary the pages can show.
schema.virtual('due').get(function due() {
  return Math.max(0, (this.price || 0) - (this.paid || 0))
})
schema.virtual('paymentStatus').get(function paymentStatus() {
  if (this.status === 'declined' && this.paid > 0) return 'refund_pending'
  if (this.paid <= 0) return 'unpaid'
  return this.paid >= this.price ? 'paid' : 'partial'
})

const bad = (message) => new ApiError(HTTP.BAD_REQUEST, message)
const mask = (n) => `${n.slice(0, 3)}****${n.slice(-4)}`

// Takes one payment. All the payment rules live here, so every route follows the same rules.
schema.methods.pay = async function pay({ method, wallet, amount }) {
  if (this.status === 'declined') throw new ApiError(HTTP.CONFLICT, MSG.BOOKING_CLOSED)
  const due = this.price - this.paid
  if (due <= 0) throw new ApiError(HTTP.CONFLICT, MSG.ALREADY_PAID)
  if (!METHODS.includes(method)) throw bad('Choose bKash or Nagad')
  const number = String(wallet ?? '').replace(/\s|-/g, '')
  if (!/^01[3-9]\d{8}$/.test(number)) throw bad('Enter a valid 11-digit mobile number, like 01712345678')
  const sum = Math.round(Number(amount))
  const min = Math.min(due, this.payments.length === 0 ? Math.ceil((this.price * MIN_ADVANCE_PERCENT) / 100) : MIN_NEXT_PAYMENT)
  if (!Number.isFinite(sum) || sum < min || sum > due) throw bad(`Amount must be between ৳ ${min.toLocaleString()} and ৳ ${due.toLocaleString()}`)

  const { trxId } = await charge({ method, wallet: number, amount: sum })
  this.payments.push({ method, wallet: mask(number), amount: sum, trxId })
  this.paid += sum
  if (this.paid >= this.price && !this.receiptNo) this.receiptNo = receiptNumber()
  return this.save()
}

// A client hires an approved, active package and pays in the same step (an advance or the full price).
// The booking is only saved if the payment goes through, so there are no unpaid orphan bookings.
schema.statics.request = async function request(clientId, { package: packageId, event, note, method, wallet, amount }) {
  const pkg = await Package.findOne({ _id: packageId, ...Package.publicFilter() })
  if (!pkg) throw new ApiError(HTTP.NOT_FOUND, MSG.NOT_FOUND)
  const booking = new this({ client: clientId, provider: pkg.provider, package: pkg._id, event, note, price: pkg.price })
  return booking.pay({ method, wallet, amount })
}

// The only way a booking changes status, so the rules are in one place.
schema.methods.moveTo = function moveTo(next) {
  if (!NEXT[this.status].includes(next)) throw new ApiError(HTTP.CONFLICT, MSG.BAD_STATUS)
  this.status = next
  if (next === 'delivered') this.progress = 100
  return this.save()
}

export default model('Booking', schema)
