import bcrypt from 'bcryptjs'
import { Schema, model } from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import { signToken } from '../utils/token.js'
const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['client', 'provider', 'admin'], default: 'client' },
    status: { type: String, enum: ['active', 'pending', 'suspended', 'rejected'], default: 'active' }, // providers start as pending until an admin verifies them
    statusNote: String, // the admin's reason for rejecting or suspending
  },
  { timestamps: true },
)
schema.pre('save', async function hash() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10)
})
schema.methods.comparePassword = function compare(plain) {
  return bcrypt.compare(plain, this.password)
}
schema.methods.generateToken = function token() {
  return signToken(this.id)
}
// Admins can activate, reject or suspend an account. The rule lives here, not in the service.
schema.methods.changeStatus = function changeStatus(status, note) {
  if (!['active', 'suspended', 'rejected'].includes(status)) throw new ApiError(HTTP.BAD_REQUEST, MSG.BAD_STATUS)
  if (status !== 'active' && !String(note ?? '').trim()) throw new ApiError(HTTP.BAD_REQUEST, MSG.NEED_REASON)
  this.status = status
  this.statusNote = status === 'active' ? '' : String(note).trim()
  return this.save()
}
schema.methods.isBlocked = function isBlocked() {
  return ['suspended', 'rejected'].includes(this.status)
}
schema.methods.toPublic = function toPublic() {
  return { id: this.id, name: this.name, email: this.email, role: this.role, status: this.status, statusNote: this.statusNote }
}
export default model('User', schema)
