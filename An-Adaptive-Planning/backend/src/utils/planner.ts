import type { EventType, IEvent } from '../models/event.model.js'

// Builds the first draft of a plan when a client sends an event for review.
// The admin reads this draft and approves or rejects it.
const PHASES: Record<EventType, [string, string[]][]> = {
  Moving: [
    ['Prepare', ['Declutter every room', 'Collect boxes, tape and markers']],
    ['Pack', ['Pack room by room and label every box', 'Book the moving crew']],
    ['Transfer', ['Confirm the crew and the truck', 'Change your address with the bank and utilities']],
    ['Moving day', ['Load and unload the truck', 'Unpack the essentials first']],
  ],
  Party: [
    ['Plan', ['Fix the date and the guest list', 'Choose the venue and the theme']],
    ['Book', ['Book the food and the cake', 'Book decoration and sound']],
    ['Prepare', ['Send the invitations', 'Confirm every booking']],
    ['Party day', ['Set up the venue', 'Enjoy it, then clean up']],
  ],
  Trip: [
    ['Plan', ['Pick the destination and dates', 'Agree the budget with everyone']],
    ['Book', ['Book transport', 'Book the stay']],
    ['Prepare', ['Pack and check documents', 'Share the itinerary with the group']],
    ['Trip', ['Travel and enjoy', 'Keep receipts to track the budget']],
  ],
  Farewell: [
    ['Plan', ['Pick the date and the venue', 'Make the guest list']],
    ['Arrange', ['Book the food', 'Prepare a gift or a card']],
    ['Prepare', ['Invite everyone', 'Confirm the bookings']],
    ['Farewell day', ['Set up the venue', 'Host and say goodbye']],
  ],
  Other: [
    ['Plan', ['Write down the goal and the date', 'List what you need']],
    ['Arrange', ['Book the main services', 'Set the budget for each part']],
    ['Prepare', ['Confirm every booking', 'Share the plan with helpers']],
    ['Event day', ['Run the plan', 'Review what worked']],
  ],
}

const RISK: Record<EventType, string> = {
  Moving: 'The crew booking is the main risk. Suggested hiring in week 1.',
  Party: 'The venue and the food are the main risks. Book them in the first days.',
  Trip: 'Transport and the stay fill up fast. Book them first.',
  Farewell: 'Fix the date and the venue early so guests can plan.',
  Other: 'Confirm the main booking early.',
}

export function buildPlan(event: Pick<IEvent, 'type' | 'budget' | 'deadline'>) {
  const days = event.deadline ? Math.max(1, Math.ceil((+event.deadline - Date.now()) / 86_400_000)) : 14
  const steps = PHASES[event.type] ?? PHASES.Other
  const phases = steps.map(([name, tasks], i) => {
    const from = Math.floor((i * days) / steps.length) + 1
    const to = Math.max(from, Math.floor(((i + 1) * days) / steps.length))
    return { name: `${name} · ${from === to ? `day ${from}` : `days ${from}-${to}`}`, tasks }
  })
  const tight = days < 7 ? `Tight timeline: only ${days} day${days === 1 ? '' : 's'} left, so book providers first. ` : ''
  return {
    phases,
    budgetEstimate: Math.round(event.budget * 0.9),
    companionNotes: tight + (RISK[event.type] ?? RISK.Other),
  }
}
