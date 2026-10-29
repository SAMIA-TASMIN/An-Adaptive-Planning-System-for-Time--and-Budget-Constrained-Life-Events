import connectDB from '../config/db.js'
import Package from '../models/package.model.js'
import User from '../models/user.model.js'
// Demo data so the pages have something to show. Safe to run again. Run: npm run seed:demo
await connectDB()
const accounts = [
  { name: 'Adaptive Planning Admin', email: 'admin@adaptiveplanning.test', password: 'admin123', role: 'admin' },
  { name: 'Demo Client', email: 'client@adaptiveplanning.test', password: 'client123', role: 'client' },
  { name: 'SwiftMove', email: 'swiftmove@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  { name: 'PartyNest', email: 'partynest@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  { name: 'TripEase', email: 'tripease@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  { name: 'DreamKnot', email: 'dreamknot@adaptiveplanning.test', password: 'provider123', role: 'provider' },
]
const users = {}
for (const a of accounts) users[a.name] = (await User.findOne({ email: a.email })) || (await User.create(a))
const img = (n) => `/images/packages/${n}.jpg`
// [provider, title, category, price (taka), duration, rating, image file, description]
// Birthday and Farewell have their own category. Every other event is grouped under "Other" in the Marketplace.
const packages = [
  ['PartyNest', 'Birthday party kit', 'Birthday', 6500, '1 day', 4.8, 'birthday-party', 'Balloons, cake table, music and a host for your birthday party.'],
  ['PartyNest', 'Farewell setup', 'Farewell', 5000, 'Half day', 4.8, 'farewell', 'Stage, banners, seating and photo corner for a farewell.'],
  ['SwiftMove', 'Moving crew, 2 rooms', 'Moving', 9000, '1 day', 4.9, 'moving-crew', 'Loaders, truck and careful packing for a 2 room move.'],
  ['SwiftMove', 'Packing service', 'Moving', 4000, 'Half day', 4.6, 'packing', 'Boxes, tape and a team that packs everything safely.'],
  ['TripEase', 'Road trip planner', 'Trips', 3500, '2 days', 4.7, 'road-trip', 'Route, stops, stays and a budget for your road trip.'],
  ['TripEase', "Cox's Bazar weekend", 'Trips', 12000, '3 days', 4.9, 'beach-weekend', 'Hotel, transport and beach activities for a long weekend.'],
  ['TripEase', 'Family tour package', 'Trips', 22000, '3 days', 4.7, 'FamilyTour', 'A relaxed family tour with a beachside setup, stay and transport.'],
  ['DreamKnot', 'Wedding ceremony package', 'Other', 85000, '1 day', 4.9, 'wedding', 'Full wedding planning: stage, floral decor, photography and coordination.'],
  ['DreamKnot', 'Proposal setup', 'Other', 18000, 'Half day', 4.8, 'propasalForMarry', 'A floral ring arch, rose petals and lights for the perfect proposal.'],
  ['DreamKnot', 'Celebrate a day with someone special', 'Other', 15000, 'Half day', 4.8, 'celebratingDayWithSpecialperson', 'A private lakeside floral gazebo for an anniversary or a special day.'],
  ['DreamKnot', 'Home decor for functions', 'Other', 24000, '1 day', 4.7, 'homeDecorForFunction', 'Garden arches, flowers and seating for a function at home.'],
  ['DreamKnot', 'Special occasion venue decor', 'Other', 45000, '1 day', 4.9, 'occation', 'A white floral aisle and golden chairs for any grand occasion.'],
]
for (const [by, title, category, price, duration, rating, image, description] of packages) {
  const provider = users[by]._id
  const data = { category, price, duration, rating, description, image: img(image), status: 'approved' }
  const found = await Package.findOne({ provider, title })
  if (found) await found.set(data).save() // run again to refresh categories and photos
  else await Package.create({ provider, title, ...data })
}
console.log(
  'Demo data ready. Logins: admin@adaptiveplanning.test / admin123, client@adaptiveplanning.test / client123, swiftmove@adaptiveplanning.test / provider123',
)
process.exit(0)
