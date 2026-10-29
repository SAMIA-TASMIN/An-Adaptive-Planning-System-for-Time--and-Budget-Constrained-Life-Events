import User from '../../../models/user.model.js'
import ApiError from '../../../utils/ApiError.js'
import { HTTP } from '../../../utils/httpStatus.js'
import { MSG } from '../../../utils/messages.js'
const result = (user) => ({ user: user.toPublic(), token: user.generateToken() })
export default {
  async register({ name, email, password, role }) {
    if (await User.findOne({ email })) throw new ApiError(HTTP.CONFLICT, MSG.EMAIL_TAKEN)
    const isProvider = role === 'provider' // admins are never self-registered
    const user = await User.create({
      name,
      email,
      password,
      role: isProvider ? 'provider' : 'client',
      status: isProvider ? 'pending' : 'active',
    })
    return result(user)
  },
  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) throw new ApiError(HTTP.UNAUTHORIZED, MSG.BAD_LOGIN)
    return result(user)
  },
}
