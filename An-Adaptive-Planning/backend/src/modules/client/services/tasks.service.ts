import Task from '../../../models/task.model.js'
import { owned, type Filter, type Query } from '../../../utils/crud.js'
import events from './events.service.js'

const byEvent = owned(Task, 'event') // tasks belong to an event
const FIELDS = ['title', 'priority', 'assignee', 'due', 'column', 'confirmed']
const guard = (userId: string, eventId: string) => events.get(userId, eventId) // the event must belong to this client

export default {
  async list(userId: string, eventId: string, query: Query) { await guard(userId, eventId); return byEvent.list(eventId, query) },
  async create(userId: string, eventId: string, data: Filter) { await guard(userId, eventId); return byEvent.create(eventId, data, FIELDS) },
  async update(userId: string, eventId: string, id: string, data: Filter) { await guard(userId, eventId); return byEvent.update(eventId, id, data, FIELDS) },
  async remove(userId: string, eventId: string, id: string) { await guard(userId, eventId); return byEvent.remove(eventId, id) },
}
