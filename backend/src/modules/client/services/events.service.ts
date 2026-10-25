import Event from '../../../models/event.model.js'
import { owned, type Filter } from '../../../utils/crud.js'

const mine = owned(Event, 'owner')
const FIELDS = ['title', 'type', 'deadline', 'budget', 'guests', 'notes']

export default {
  list: mine.list,
  get: mine.get,
  create: (userId: string, data: Filter) => mine.create(userId, data, FIELDS),
  update: (userId: string, id: string, data: Filter) => mine.update(userId, id, data, FIELDS),
  async submit(userId: string, id: string) { return (await mine.get(userId, id)).submitForReview() },
}
