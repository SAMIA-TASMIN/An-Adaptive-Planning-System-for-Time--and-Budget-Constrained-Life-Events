import connectDB from '../config/db.js'
import User from '../models/user.model.js'

// Admins cannot register through the API. Run once: npm run seed:admin
await connectDB()
const email = 'admin@planly.test'
if (!(await User.findOne({ email }))) {
  await User.create({ name: 'Planly Admin', email, password: 'admin123', role: 'admin' })
  console.log(`Admin created: ${email} / admin123 (change this password)`)
} else console.log('Admin already exists')
process.exit(0)
