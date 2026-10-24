import type { BookingItem } from '../types'
import { api } from './client'

interface ApiBooking { _id: string; package?: { title?: string; image?: string }; provider?: { name?: string }; progress: number; status: string }

const LABEL: Record<string, string> = { requested: 'Requested', accepted: 'Accepted', in_progress: 'In progress', delivered: 'Delivered', declined: 'Declined' }

export const hire = (packageId: string | number) => api('/client/bookings', { method: 'POST', body: { package: packageId } })
export const getBookings = async (): Promise<BookingItem[]> =>
  (await api<{ items: ApiBooking[] }>('/client/bookings')).items.map((b) => ({ id: b._id, pack: b.package?.title, by: b.provider?.name, img: b.package?.image, progress: b.progress, status: LABEL[b.status] }))
