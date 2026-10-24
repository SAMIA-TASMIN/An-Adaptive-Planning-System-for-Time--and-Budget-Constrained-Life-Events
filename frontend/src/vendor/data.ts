import type { DayState, VendorJob, VendorPackage, VendorProfile, VendorRequest, VendorReview } from '../types'

// Sample data for the vendor panel. Replace with real API data later.
export const REQUESTS: VendorRequest[] = [
  { id: 1, client: 'Mahi', pack: 'Moving crew, 2 rooms', date: '21 Oct', budget: 9000, place: 'Chattogram' },
  { id: 2, client: 'Nova', pack: 'Moving crew, 1 room', date: '24 Oct', budget: 5500, place: 'Chattogram' },
  { id: 3, client: 'Sami', pack: 'Packing service', date: '27 Oct', budget: 4000, place: "Cox's Bazar" },
]
export const JOBS: VendorJob[] = [
  { id: 10, client: 'Rafi', pack: 'Moving crew, 1 room', status: 'In progress', progress: 55, price: 5500 },
  { id: 11, client: 'Tanvir', pack: 'Packing service', status: 'Accepted', progress: 15, price: 4000 },
  { id: 12, client: 'Ruhi', pack: 'Moving crew, 2 rooms', status: 'Delivered', progress: 100, price: 9000 },
]
export const PACKAGES: VendorPackage[] = [
  { id: 1, icon: '📦', img: '/images/packages/moving-crew.jpg', title: 'Moving crew, 2 rooms', price: 9000, duration: '1 day', bookings: 24, active: true, approved: true },
  { id: 2, icon: '🚚', img: '/images/packages/moving-crew.jpg', title: 'Moving crew, 1 room', price: 5500, duration: '1 day', bookings: 17, active: true, approved: true },
  { id: 3, icon: '🧰', img: '/images/packages/packing.jpg', title: 'Packing service', price: 4000, duration: 'Half day', bookings: 7, active: false, approved: true },
]
export const REVIEWS: VendorReview[] = [
  { id: 1, name: 'Ruhi', stars: 5, pack: 'Moving crew, 2 rooms', text: 'On time, careful with everything, and very friendly.' },
  { id: 2, name: 'Rafi', stars: 5, pack: 'Moving crew, 1 room', text: 'Fair price and no damage. Would hire again.' },
  { id: 3, name: 'Nila', stars: 4, pack: 'Packing service', text: 'Good work, arrived a little late.' },
]
export const MONTHS: [string, number][] = [['Jun', 18000], ['Jul', 24500], ['Aug', 21000], ['Sep', 33000], ['Oct', 42000]]
export const AVAIL: DayState[] = ['open', 'open', 'off', 'open', 'open', 'booked', 'booked', 'open', 'open', 'off', 'open', 'open', 'open', 'open']
export const PROFILE: VendorProfile = {
  name: 'SwiftMove', category: 'Moving services', area: 'Chattogram', phone: '01700 000000',
  about: 'A careful moving crew with a covered truck. We pack, load and unload.',
}
