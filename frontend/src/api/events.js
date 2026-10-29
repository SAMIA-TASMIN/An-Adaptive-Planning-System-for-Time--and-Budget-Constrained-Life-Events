import { api } from './client'
const TITLE = { Moving: 'Moving home', Party: 'Party', Trip: 'Trip', Farewell: 'Farewell', Other: 'Event' }
const ICON = { Moving: '📦', Party: '🎉', Trip: '🚗', Farewell: '🎓', Other: '✨' }
const IMG = {
  Moving: '/images/packages/moving-crew.jpg',
  Party: '/images/packages/birthday-party.jpg',
  Trip: '/images/packages/road-trip.jpg',
  Farewell: '/images/packages/farewell.jpg',
}
const STATUS = {
  draft: ['Draft', 'lilac', 5],
  submitted: ['Waiting for review', 'amber', 20],
  in_review: ['In review', 'blue', 35],
  planned: ['Planned', 'blue', 50],
  approved: ['Approved', 'green', 70],
  rejected: ['Needs changes', 'red', 20],
}
export const askCompanion = (message, draft) => api('/client/companion', { method: 'POST', body: { message, draft } })
export const getEvents = async () => (await api('/client/events?limit=50')).items
export const getEventPlan = (id) => api(`/client/events/${id}/plan`)
// Creates the event from what the companion collected, then sends it to the admin for review.
export async function sendEvent(draft) {
  const type = draft.type ?? 'Other'
  const deadline = new Date(Date.now() + (draft.days ?? 14) * 86_400_000)
  const when = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const event = await api('/client/events', {
    method: 'POST',
    body: {
      title: `${TITLE[type]} · ${when}`,
      type,
      deadline: deadline.toISOString(),
      budget: draft.budget ?? 0,
      guests: draft.people,
      notes: draft.notes,
    },
  })
  return api(`/client/events/${event._id}/submit`, { method: 'POST' })
}
export const daysLeft = (iso) => (iso ? Math.ceil((+new Date(iso) - Date.now()) / 86_400_000) : null)
export function toEventItem(e) {
  const d = daysLeft(e.deadline)
  const [status, tone, progress] = STATUS[e.status] ?? ['Draft', 'lilac', 0]
  const left = d === null ? 'No deadline' : d < 0 ? 'Deadline passed' : d === 0 ? 'Due today' : `${d} day${d === 1 ? '' : 's'} left`
  return { id: e._id, icon: ICON[e.type], title: e.title, img: IMG[e.type], left, progress, status, tone }
}
