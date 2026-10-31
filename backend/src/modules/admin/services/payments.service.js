import Booking from '../../../models/booking.model.js'
import { paginate } from '../../../utils/paginate.js'
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export default {
  // Every single transaction (one booking can have several), newest first.
  // ?method=bkash|nagad  ?q=part of a transaction id  ?page= ?limit=
  async list(query) {
    const { page, limit, skip } = paginate(query)
    const match = {}
    if (['bkash', 'nagad'].includes(query.method)) match['payments.method'] = query.method
    if (typeof query.q === 'string' && query.q.trim()) match['payments.trxId'] = new RegExp(escape(query.q.trim()), 'i')
    const [res] = await Booking.aggregate([
      { $unwind: '$payments' },
      { $match: match },
      { $sort: { 'payments.paidAt': -1 } },
      {
        $facet: {
          items: [
            { $skip: skip },
            { $limit: limit },
            { $project: { booking: '$_id', client: 1, provider: 1, package: 1, price: 1, paid: 1, status: 1, payment: '$payments' } },
          ],
          total: [{ $count: 'n' }],
        },
      },
    ])
    const items = await Booking.populate(res.items, [
      { path: 'client', select: 'name email' },
      { path: 'provider', select: 'name' },
      { path: 'package', select: 'title' },
    ])
    return { items, total: res.total[0]?.n ?? 0, page, limit }
  },

  // The money picture for the admin dashboard.
  async summary() {
    const [[totals], methods] = await Promise.all([
      Booking.aggregate([
        {
          $group: {
            _id: null,
            bookings: { $sum: 1 },
            collected: { $sum: '$paid' },
            refunded: { $sum: { $ifNull: ['$refund.amount', 0] } },
            booked: { $sum: { $cond: [{ $eq: ['$status', 'declined'] }, 0, '$price'] } },
            due: { $sum: { $cond: [{ $eq: ['$status', 'declined'] }, 0, { $max: [0, { $subtract: ['$price', '$paid'] }] }] } },
            refundPending: {
              $sum: { $cond: [{ $and: [{ $eq: ['$status', 'declined'] }, { $not: ['$refund.at'] }] }, '$paid', 0] },
            },
            fullyPaid: { $sum: { $cond: [{ $and: [{ $ne: ['$status', 'declined'] }, { $gt: ['$paid', 0] }, { $gte: ['$paid', '$price'] }] }, 1, 0] } },
          },
        },
      ]),
      Booking.aggregate([
        { $unwind: '$payments' },
        { $group: { _id: '$payments.method', transactions: { $sum: 1 }, amount: { $sum: '$payments.amount' } } },
      ]),
    ])
    const t = totals ?? { bookings: 0, collected: 0, refunded: 0, booked: 0, due: 0, refundPending: 0, fullyPaid: 0 }
    const byMethod = Object.fromEntries(methods.map((m) => [m._id, { transactions: m.transactions, amount: m.amount }]))
    return {
      bookings: t.bookings,
      fullyPaid: t.fullyPaid,
      booked: t.booked,
      collected: t.collected, // all money received
      refunded: t.refunded, // already given back
      refundPending: t.refundPending, // must be given back
      due: t.due, // clients still have to pay this
      kept: t.collected - t.refunded - t.refundPending, // money that stays after refunds
      byMethod: { bkash: byMethod.bkash ?? { transactions: 0, amount: 0 }, nagad: byMethod.nagad ?? { transactions: 0, amount: 0 } },
    }
  },
}
