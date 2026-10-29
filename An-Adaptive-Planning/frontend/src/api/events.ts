import type { EventItem, Tone } from '../types'
import { api } from './client'

export type EventType = 'Moving' | 'Party' | 'Trip' | 'Farewell' | 'Other'
export type Slot = 'type' | 'days' | 'budget' | 'people' | 'notes'
// What the companion has understood so far. The server sends it back with every reply.
export interface Draft { type?: EventType; days?: number; budget?: number; people?: number; notes?: string; asking?: Slot }
export interface CompanionReply { reply: string; draft: Draft; ready: boolean }

export interface ApiEvent { _id: string; title: string; type: EventType; deadline?: string; budget: number; guests?: number; notes?: string; status: string }
// What a client may see of a plan. Phases only arrive once the admin has approved it.
export interface PlanView { approvalStatus: string; adminComment?: string; phases?: { name?: string; tasks: string[] }[]; budgetEstimate?: number; companionNotes?: string }

const TITLE: Record<EventType, string> = { Moving: 'Moving home', Party: 'Party', Trip: 'Trip', Farewell: 'Farewell', Other: 'Event' }
const ICON: Record<EventType, string> = { Moving: '📦', Party: '🎉', Trip: '🚗', Farewell: '🎓', Other: '✨' }
const IMG: Partial<Record<EventType, string>> = { Moving: '/images/packages/moving-crew.jpg', Party: '/images/packages/birthday-party.jpg', Trip: '/images/packages/road-trip.jpg', Farewell: '/images/packages/farewell.jpg' }
const STATUS: Record<string, [string, Tone, number]> = {
  draft: ['Draft', 'lilac', 5], submitted: ['Waiting for review', 'amber', 20], in_review: ['In review', 'blue', 35],
  planned: ['Planned', 'blue', 50], approved: ['Approved', 'green', 70], rejected: ['Needs changes', 'red', 20],
}

export const askCompanion = (message: string, draft: Draft) => api<CompanionReply>('/client/companion', { method: 'POST', body: { message, draft } })
export const getEvents = async () => (await api<{ items: ApiEvent[] }>('/client/events?limit=50')).items
export const getEventPlan = (id: string) => api<PlanView | null>(`/client/events/${id}/plan`)

// Creates the event from what the companion collected, then sends it to the admin for review.
export async function sendEvent(draft: Draft): Promise<ApiEvent> {
  const type = draft.type ?? 'Other'
  const deadline = new Date(Date.now() + (draft.days ?? 14) * 86_400_000)
  const when = deadline.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const event = await api<ApiEvent>('/client/events', {
    method: 'POST',
    body: { title: `${TITLE[type]} · ${when}`, type, deadline: deadline.toISOString(), budget: draft.budget ?? 0, guests: draft.people, notes: draft.notes },
  })
  return api<ApiEvent>(`/client/events/${event._id}/submit`, { method: 'POST' })
}

export const daysLeft = (iso?: string) => (iso ? Math.ceil((+new Date(iso) - Date.now()) / 86_400_000) : null)

export function toEventItem(e: ApiEvent): EventItem {
  const d = daysLeft(e.deadline)
  const [status, tone, progress] = STATUS[e.status] ?? ['Draft', 'lilac', 0]
  const left = d === null ? 'No deadline' : d < 0 ? 'Deadline passed' : d === 0 ? 'Due today' : `${d} day${d === 1 ? '' : 's'} left`
  return { id: e._id, icon: ICON[e.type], title: e.title, img: IMG[e.type], left, progress, status, tone }
}
