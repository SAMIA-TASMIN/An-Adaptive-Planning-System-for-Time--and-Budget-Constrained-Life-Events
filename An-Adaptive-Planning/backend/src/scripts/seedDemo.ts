import connectDB from '../config/db.js'
import Package from '../models/package.model.js'
import User, { type Role, type UserDoc } from '../models/user.model.js'

// Demo data so the pages have something to show. Safe to run again. Run: npm run seed:demo
await connectDB()

const accounts: { name: string; email: string; password: string; role: Role }[] = [
  { name: 'Planly Admin', email: 'admin@planly.test', password: 'admin123', role: 'admin' },
  { name: 'Demo Client', email: 'client@planly.test', password: 'client123', role: 'client' },
  { name: 'SwiftMove', email: 'swiftmove@planly.test', password: 'provider123', role: 'provider' },
  { name: 'PartyNest', email: 'partynest@planly.test', password: 'provider123', role: 'provider' },
  { name: 'TripEase', email: 'tripease@planly.test', password: 'provider123', role: 'provider' },
]
const users: Record<string, UserDoc> = {}
for (const a of accounts) users[a.name] = (await User.findOne({ email: a.email })) || (await User.create(a))

const img = (n: string) => `/images/packages/${n}.jpg`
const packages: [string, string, 'Parties' | 'Moving' | 'Trips' | 'Other', number, string, number, string][] = [
  ['SwiftMove', 'Moving crew, 2 rooms', 'Moving', 9000, '1 day', 4.9, 'moving-crew'],
  ['PartyNest', 'Birthday party kit', 'Parties', 6500, '1 day', 4.8, 'birthday-party'],
  ['TripEase', 'Road trip planner', 'Trips', 3500, '2 days', 4.7, 'road-trip'],
  ['SwiftMove', 'Packing service', 'Moving', 4000, 'Half day', 4.6, 'packing'],
  ['PartyNest', 'Farewell setup', 'Parties', 5000, 'Half day', 4.8, 'farewell'],
  ['TripEase', "Cox's Bazar weekend", 'Trips', 12000, '3 days', 4.9, 'beach-weekend'],
]
for (const [by, title, category, price, duration, rating, image] of packages) {
  const provider = users[by]._id
  if (!(await Package.findOne({ provider, title }))) await Package.create({ provider, title, category, price, duration, rating, image: img(image), status: 'approved' })
}
console.log('Demo data ready. Logins: admin@planly.test / admin123, client@planly.test / client123, swiftmove@planly.test / provider123')
process.exit(0)
