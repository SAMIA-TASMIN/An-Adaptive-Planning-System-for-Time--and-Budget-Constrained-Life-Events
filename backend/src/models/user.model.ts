import bcrypt from 'bcryptjs'
import { HydratedDocument, Model, Schema, model } from 'mongoose'
import ApiError from '../utils/ApiError.js'
import { HTTP } from '../utils/httpStatus.js'
import { MSG } from '../utils/messages.js'
import { signToken } from '../utils/token.js'

export type Role = 'client' | 'provider' | 'admin'
export type UserStatus = 'active' | 'pending' | 'suspended'

export interface IUser { name: string; email: string; password: string; role: Role; status: UserStatus }
export interface PublicUser { id: string; name: string; email: string; role: Role; status: UserStatus }
interface IUserMethods {
  comparePassword(plain: string): Promise<boolean>
  generateToken(): string
  changeStatus(status: string): Promise<UserDoc>
  toPublic(): PublicUser
}
type UserModel = Model<IUser, object, IUserMethods>
export type UserDoc = HydratedDocument<IUser, IUserMethods>

const schema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['client', 'provider', 'admin'], default: 'client' },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' }, // providers start as pending until an admin verifies them
}, { timestamps: true })

schema.pre('save', async function hash() {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10)
})
schema.methods.comparePassword = function compare(this: UserDoc, plain: string) { return bcrypt.compare(plain, this.password) }
schema.methods.generateToken = function token(this: UserDoc) { return signToken(this.id) }
// Admins can only activate or suspend an account. The rule lives here, not in the service.
schema.methods.changeStatus = function changeStatus(this: UserDoc, status: string) {
  if (!['active', 'suspended'].includes(status)) throw new ApiError(HTTP.BAD_REQUEST, MSG.BAD_STATUS)
  this.status = status as UserStatus
  return this.save()
}
schema.methods.toPublic = function toPublic(this: UserDoc): PublicUser {
  return { id: this.id, name: this.name, email: this.email, role: this.role, status: this.status }
}

export default model<IUser, UserModel>('User', schema)
