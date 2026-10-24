import User, { type UserDoc } from '../../../models/user.model.js'
import ApiError from '../../../utils/ApiError.js'
import { HTTP } from '../../../utils/httpStatus.js'
import { MSG } from '../../../utils/messages.js'

interface RegisterInput { name: string; email: string; password: string; role?: string }
interface LoginInput { email: string; password: string }

const result = (user: UserDoc) => ({ user: user.toPublic(), token: user.generateToken() })

export default {
  async register({ name, email, password, role }: RegisterInput) {
    if (await User.findOne({ email })) throw new ApiError(HTTP.CONFLICT, MSG.EMAIL_TAKEN)
    const isProvider = role === 'provider' // admins are never self-registered
    const user = await User.create({ name, email, password, role: isProvider ? 'provider' : 'client', status: isProvider ? 'pending' : 'active' })
    return result(user)
  },
  async login({ email, password }: LoginInput) {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) throw new ApiError(HTTP.UNAUTHORIZED, MSG.BAD_LOGIN)
    return result(user)
  },
}
