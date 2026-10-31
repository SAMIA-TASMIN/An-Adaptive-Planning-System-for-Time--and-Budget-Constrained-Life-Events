import { EVENTS } from '../models/package.model.js'
export const create = {
  title: { required: true },
  price: { required: true, type: 'number' },
  category: { oneOf: EVENTS },
}
