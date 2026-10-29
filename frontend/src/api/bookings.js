import { api } from './client'

const LABEL = { requested: 'Requested', accepted: 'Accepted', in_progress: 'In progress', delivered: 'Delivered', declined: 'Declined' }

// Hiring a package and paying (an advance or the full price) happen in one request.
// payment = { method: 'bkash' | 'nagad', wallet: '01XXXXXXXXX', amount: 1234 }
export const hire = (packageId, payment) => api('/client/bookings', { method: 'POST', body: { package: packageId, ...payment } })

// Pay what is left (or part of it) on a booking you already have.
export const payBooking = (bookingId, payment) => api(`/client/bookings/${bookingId}/pay`, { method: 'POST', body: payment })

const toBooking = (b) => ({
  id: b._id,
  pack: b.package?.title,
  by: b.provider?.name,
  img: b.package?.image,
  progress: b.progress,
  status: LABEL[b.status],
  total: b.price || 0,
  paid: b.paid || 0,
  due: b.due ?? Math.max(0, (b.price || 0) - (b.paid || 0)),
  payStatus: b.paymentStatus,
  payments: b.payments || [],
  receiptNo: b.receiptNo,
  createdAt: b.createdAt,
})
export const getBookings = async () => (await api('/client/bookings?limit=100')).items.map(toBooking)
export { toBooking }
