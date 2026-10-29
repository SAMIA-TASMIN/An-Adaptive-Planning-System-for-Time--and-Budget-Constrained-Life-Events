import connectDB from '../config/db.js'
import User from '../models/user.model.js'
// Admins cannot register through the API. Run once: npm run seed:admin
// Set ADMIN_PASSWORD before running this against a real (public) database.
const password = process.env.ADMIN_PASSWORD ?? 'admin123'
await connectDB()
const email = 'admin@adaptiveplanning.test'
if (!(await User.findOne({ email }))) {
  await User.create({ name: 'Adaptive Planning Admin', email, password, role: 'admin' })
  console.log(`Admin created: ${email}` + (process.env.ADMIN_PASSWORD ? '' : ' / admin123 (default - set ADMIN_PASSWORD to change it)'))
} else console.log('Admin already exists')
process.exit(0)
