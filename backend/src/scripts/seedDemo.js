import connectDB from '../config/db.js'
import Booking from '../models/booking.model.js'
import Package from '../models/package.model.js'
import User from '../models/user.model.js'
// Demo data so every page has something to show. Safe to run again. Run: npm run seed
// Set ADMIN_PASSWORD (and DEMO_PASSWORD) before running this against a public database.
await connectDB()
const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'
const accounts = [
  { name: 'Adaptive Planning Admin', email: 'admin@adaptiveplanning.test', password: adminPassword, role: 'admin' },
  { name: 'Demo Client', email: 'client@adaptiveplanning.test', password: 'client123', role: 'client' },
  { name: 'SwiftMove', email: 'swiftmove@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  { name: 'PartyNest', email: 'partynest@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  { name: 'TripEase', email: 'tripease@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  { name: 'DreamKnot', email: 'dreamknot@adaptiveplanning.test', password: 'provider123', role: 'provider' },
  // A new provider waiting for the admin (shows in Admin > Providers > Pending).
  { name: 'Glow Events', email: 'glow@adaptiveplanning.test', password: 'provider123', role: 'provider', status: 'pending' },
]
const users = {}
for (const a of accounts) users[a.name] = (await User.findOne({ email: a.email })) || (await User.create(a))

const img = (n) => `/images/packages/${n}.jpg`
// Event groups: Birthday | Farewell | Wedding | HomeDecor | Moving | Trips | Else
// A package can sit in more than one group (list them all in "events").
// [provider, title, main group, events, price (taka), duration, rating, image file, description, status]
const packages = [
  ['PartyNest', 'Birthday party kit', 'Birthday', ['Birthday'], 6500, '1 day', 4.8, 'birthday-party', 'Balloons, cake table, music and a host for your birthday party.'],
  ['PartyNest', 'Farewell setup', 'Farewell', ['Farewell'], 5000, 'Half day', 4.8, 'farewell', 'Stage, banners, seating and photo corner for a farewell.'],
  // Wedding & Proposal
  ['DreamKnot', 'Wedding ceremony package', 'Wedding', ['Wedding'], 85000, '1 day', 4.9, 'wedding', 'Full wedding planning: stage, floral decor, photography and coordination.'],
  ['DreamKnot', 'Proposal setup', 'Wedding', ['Wedding'], 18000, 'Half day', 4.8, 'propasalForMarry', 'A floral ring arch, rose petals and lights for the perfect proposal.'],
  // Home Decor (also holds the packing and moving help for a new home)
  ['DreamKnot', 'Home decor for functions', 'HomeDecor', ['HomeDecor'], 24000, '1 day', 4.7, 'homeDecorForFunction', 'Garden arches, flowers and seating for a function at home.'],
  ['DreamKnot', 'Special occasion venue decor', 'HomeDecor', ['HomeDecor', 'Else'], 45000, '1 day', 4.9, 'occation', 'A white floral aisle and golden chairs for any grand occasion.'],
  ['SwiftMove', 'Packing service', 'Moving', ['HomeDecor', 'Moving'], 4000, 'Half day', 4.6, 'packing', 'Boxes, tape and a team that packs everything safely.'],
  ['SwiftMove', 'Moving crew, 2 rooms', 'Moving', ['HomeDecor', 'Moving'], 9000, '1 day', 4.9, 'moving-crew', 'Loaders, truck and careful packing for a 2 room move.'],
  // Trips & Tour
  ['TripEase', "Cox's Bazar weekend", 'Trips', ['Trips'], 12000, '3 days', 4.9, 'beach-weekend', 'Hotel, transport and beach activities for a long weekend.'],
  ['TripEase', 'Road trip planner', 'Trips', ['Trips'], 3500, '2 days', 4.7, 'road-trip', 'Route, stops, stays and a budget for your road trip.'],
  ['TripEase', 'Family tour package', 'Trips', ['Trips'], 22000, '3 days', 4.7, 'FamilyTour', 'A relaxed family tour with a beachside setup, stay and transport.'],
  // Something Else
  ['DreamKnot', 'Celebrate a day with someone special', 'Else', ['Else'], 15000, 'Half day', 4.8, 'celebratingDayWithSpecialperson', 'A private lakeside floral gazebo for an anniversary or a special day.'],
  // Waiting for the admin (shows in Admin > Packages > Pending)
  ['PartyNest', 'Anniversary dinner setup', 'Else', ['Else', 'Wedding'], 14000, 'Half day', 0, 'celebratingDayWithSpecialperson', 'Candles, a table for two and live music for an anniversary dinner.', 'pending'],
  ['Glow Events', 'Mehendi night decor', 'Wedding', ['Wedding'], 30000, '1 day', 0, 'wedding', 'Colourful mehendi stage, marigold decor and seating.', 'pending'],
]
for (const [by, title, category, events, price, duration, rating, image, description, status = 'approved'] of packages) {
  const provider = users[by]._id
  const data = { category, events, price, duration, rating, description, image: img(image) }
  const found = await Package.findOne({ provider, title })
  if (found) await found.set(data).save() // run again to refresh groups and photos (the status is kept)
  else await Package.create({ provider, title, ...data, status })
}

// A few bookings with payments, so Admin > Bookings and Admin > Payments are not empty.
// [package, [[method, wallet, amount], ...], status to set afterwards]
const client = users['Demo Client']
if ((await Booking.countDocuments({ client: client._id })) === 0) {
  const sample = [
    ['Wedding ceremony package', [['bkash', '01712345678', 17000], ['nagad', '01712345678', 30000]]],
    ["Cox's Bazar weekend", [['nagad', '01712345678', 12000]], 'accepted'],
    ['Proposal setup', [['bkash', '01812345678', 3600]], 'accepted'],
    ['Packing service', [['bkash', '01912345678', 800]], 'declined'],
  ]
  for (const [title, pays, status] of sample) {
    const pkg = await Package.findOne({ title })
    const [first, ...rest] = pays
    const booking = await Booking.request(client._id, { package: pkg._id, method: first[0], wallet: first[1], amount: first[2] })
    for (const [method, wallet, amount] of rest) await booking.pay({ method, wallet, amount })
    if (status) await booking.moveTo(status)
  }
}
console.log('Demo data ready.')
console.log('Logins: admin@adaptiveplanning.test, client@adaptiveplanning.test (client123), swiftmove@adaptiveplanning.test (provider123)')
console.log(process.env.ADMIN_PASSWORD ? 'Admin password: the one you set in ADMIN_PASSWORD' : 'Admin password: admin123 (set ADMIN_PASSWORD to change it)')
process.exit(0)
