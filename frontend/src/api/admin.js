import { api } from './client'
// Everything the admin panel asks the backend for. Plan calls are in plans.js.
const qs = (o = {}) => {
  const p = new URLSearchParams(Object.entries(o).filter(([, v]) => v !== undefined && v !== '' && v !== 'All'))
  return p.toString() ? `?${p}` : ''
}

// Packages (the admin approves or rejects what providers create)
export const getAdminPackages = async (status) => (await api(`/admin/packages${qs({ status, limit: 50 })}`)).items
export const getPackageCounts = () => api('/admin/packages/counts')
// action = 'approve' | 'reject' | 'suspend'  (reject and suspend need a reason)
export const decidePackage = (id, action, comment) => api(`/admin/packages/${id}/${action}`, { method: 'POST', body: { comment } })

// Providers
export const getAdminProviders = async (status) => (await api(`/admin/providers${qs({ status, limit: 50 })}`)).items
export const getProviderCounts = () => api('/admin/providers/counts')
// status = 'active' | 'rejected' | 'suspended'  (rejected and suspended need a reason)
export const setProviderStatus = (id, status, comment) => api(`/admin/providers/${id}/status`, { method: 'PATCH', body: { status, comment } })

// Bookings and their payments
export const getAdminBookings = (o) => api(`/admin/bookings${qs({ limit: 15, ...o })}`)
export const getAdminBooking = (id) => api(`/admin/bookings/${id}`)
export const getBookingCounts = () => api('/admin/bookings/counts')
export const refundBooking = (id, note) => api(`/admin/bookings/${id}/refund`, { method: 'POST', body: { note } })
// The same shape the client's payment slip already uses, plus the client name.
export const toSlip = (b) => ({
  id: b._id,
  pack: b.package?.title,
  by: b.provider?.name,
  clientName: b.client?.name,
  total: b.price || 0,
  paid: b.paid || 0,
  due: b.due ?? 0,
  receiptNo: b.receiptNo,
  payments: b.payments || [],
})

// Money
export const getPaymentSummary = () => api('/admin/payments/summary')
export const getPayments = (o) => api(`/admin/payments${qs({ limit: 15, ...o })}`)
