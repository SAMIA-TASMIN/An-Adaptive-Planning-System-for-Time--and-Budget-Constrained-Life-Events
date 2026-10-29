import { Router } from 'express'
import auth from './modules/auth/index.js'
import pub from './modules/public/index.js'
import client from './modules/client/index.js'
import provider from './modules/provider/index.js'
import admin from './modules/admin/index.js'
// One line per panel. This file is the map of the whole API.
const r = Router()
r.use('/auth', auth)
r.use('/public', pub)
r.use('/client', client)
r.use('/provider', provider)
r.use('/admin', admin)
export default r
