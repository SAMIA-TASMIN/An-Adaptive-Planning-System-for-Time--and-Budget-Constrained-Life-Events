import Task from '../../../models/task.model.js'
import { owned } from '../../../utils/crud.js'
import events from './events.service.js'
const byEvent = owned(Task, 'event') // tasks belong to an event
const FIELDS = ['title', 'priority', 'assignee', 'due', 'column', 'confirmed']
const guard = (userId, eventId) => events.get(userId, eventId) // the event must belong to this client
export default {
  async list(userId, eventId, query) {
    await guard(userId, eventId)
    return byEvent.list(eventId, query)
  },
  async create(userId, eventId, data) {
    await guard(userId, eventId)
    return byEvent.create(eventId, data, FIELDS)
  },
  async update(userId, eventId, id, data) {
    await guard(userId, eventId)
    return byEvent.update(eventId, id, data, FIELDS)
  },
  async remove(userId, eventId, id) {
    await guard(userId, eventId)
    return byEvent.remove(eventId, id)
  },
}
