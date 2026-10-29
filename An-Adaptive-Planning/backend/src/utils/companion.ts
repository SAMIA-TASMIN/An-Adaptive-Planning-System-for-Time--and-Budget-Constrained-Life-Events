import type { EventType } from '../models/event.model.js'

// The planning companion. It reads one chat message, fills in what it understands,
// and asks for the next missing detail. It needs no outside AI service.
// To use a real AI model later, replace talk() and keep the same input and output.
export type Slot = 'type' | 'days' | 'budget' | 'people' | 'notes'
export interface Draft { type?: EventType; days?: number; budget?: number; people?: number; notes?: string; asking?: Slot }
export interface CompanionReply { reply: string; draft: Draft; ready: boolean }

const SLOTS: Slot[] = ['type', 'days', 'budget', 'people', 'notes']
const KINDS: EventType[] = ['Moving', 'Party', 'Trip', 'Farewell', 'Other']

// The first rule that matches wins, so "farewell party" is a Farewell, not a Party.
const TYPE_RULES: [EventType, RegExp][] = [
  ['Farewell', /farewell|goodbye|send-?off/],
  ['Moving', /\bmov(?:e|ing|ed)\b|relocat|\bshift(?:ing)?\b|\bflat\b|new (?:house|home|apartment)/],
  ['Trip', /\btrips?\b|travel|\btour\b|vacation|holiday|beach|\bcox/],
  ['Party', /part(?:y|ies)|birthday|celebrat|wedding|anniversary|reunion|graduation/],
  ['Other', /something else|\bother\b/],
]
const LABEL: Record<EventType, string> = { Moving: 'a move', Party: 'a party', Trip: 'a trip', Farewell: 'a farewell', Other: 'something else' }

const NUM_WORDS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 }
const UNIT: Record<string, number> = { day: 1, week: 7, wk: 7, month: 30 }
const MULTIPLIER: Record<string, number> = { k: 1000, thousand: 1000, lakh: 100000, lac: 100000 }

const TIME = /\b(\d+(?:\.\d+)?|an?|one|two|three|four|five|six|seven|eight|nine|ten|twelve)\s*(day|week|wk|month)s?\b/
const PEOPLE = /\b(\d+)\s*(?:helpers?|people|persons?|friends?|guests?|members?|volunteers?|hands)\b/
const ALONE = /\b(?:just me|alone|myself|no ?one|nobody|no helpers?|no guests?)\b/

const AMOUNT = '(\\d[\\d,]*(?:\\.\\d+)?)(?:\\s*(k|thousand|lakh|lac)\\b)?'
const CURRENCY = '(?:৳|\\btk\\.?|\\btaka\\b|\\bbdt\\b)'
const BUDGET_RULES = [
  new RegExp(`${CURRENCY}\\s*${AMOUNT}`),
  new RegExp(`${AMOUNT}\\s*(?:৳|tk|taka|bdt)\\b`),
  new RegExp(`(?:budget|under|within|around|about|max(?:imum)?)\\s*(?:is|of|:)?\\s*(?:${CURRENCY})?\\s*${AMOUNT}`),
]
const LOOSE_NUMBER = new RegExp(`\\b${AMOUNT}`)

const taka = (n: number) => `৳ ${n.toLocaleString('en-US')}`
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`
const showDays = (d: number) => (d >= 7 && d % 7 === 0 ? plural(d / 7, 'week') : plural(d, 'day'))
const amount = (m: RegExpMatchArray) => Math.round(Number(m[1].replace(/,/g, '')) * (MULTIPLIER[m[2]] ?? 1))

// Finds a pattern and returns the match plus the text with that part removed.
const take = (text: string, re: RegExp): [RegExpMatchArray | null, string] => {
  const m = text.match(re)
  return m ? [m, text.replace(re, ' ')] : [null, text]
}

const ASK: Record<Slot, (d: Draft) => string> = {
  type: () => 'What are we planning? A move, a party, a trip or a farewell?',
  days: () => 'When do you need it done? For example “3 weeks” or “10 days”.',
  budget: () => 'What budget feels comfortable? For example “৳ 20,000”.',
  people: (d) => (d.type === 'Moving' ? 'How many people can help you on the day?' : 'How many people will be involved, helpers or guests?'),
  notes: () => 'Anything else the team should know? Type “no” to skip.',
}

// Only these fields are accepted from the browser, so a bad request cannot store anything else.
export function cleanDraft(raw: unknown): Draft {
  const d = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined)
  return {
    type: KINDS.find((k) => k === d.type),
    days: num(d.days),
    budget: num(d.budget),
    people: num(d.people),
    notes: typeof d.notes === 'string' ? d.notes.slice(0, 500) : undefined,
    asking: SLOTS.find((s) => s === d.asking),
  }
}

export function talk(message: string, previous: Draft): CompanionReply {
  const text = message.toLowerCase().trim()
  const draft: Draft = { ...previous }
  const got: string[] = []
  const asked = previous.asking

  if (asked === 'notes') {
    draft.notes = /^(no|nope|none|nothing|skip|that'?s all)\b/.test(text) ? 'None' : message.trim().slice(0, 500)
    got.push('your notes')
  } else {
    const kind = TYPE_RULES.find(([, re]) => re.test(text))?.[0]
    if (kind) { draft.type = kind; got.push(LABEL[kind]) }

    let rest = text
    let m: RegExpMatchArray | null
    ;[m, rest] = take(rest, TIME)
    let days = m ? Math.max(1, Math.round((NUM_WORDS[m[1]] ?? Number(m[1])) * UNIT[m[2]])) : undefined
    if (days === undefined) days = /\btomorrow\b/.test(rest) ? 1 : /\bnext week\b/.test(rest) ? 7 : /\bnext month\b/.test(rest) ? 30 : undefined

    ;[m, rest] = take(rest, PEOPLE)
    let people = m ? Number(m[1]) : ALONE.test(rest) ? 0 : undefined

    let budget: number | undefined
    for (const re of BUDGET_RULES) {
      const b = rest.match(re)
      if (b) { budget = amount(b); rest = rest.replace(re, ' '); break }
    }

    // A bare number is read as the answer to the question that was just asked.
    const loose = rest.match(LOOSE_NUMBER)
    if (loose) {
      const value = amount(loose)
      if (asked === 'budget' && budget === undefined) budget = value
      else if (asked === 'people' && people === undefined && value <= 1000) people = value
      else if (asked === 'days' && days === undefined && value <= 365) days = value
      else if (budget === undefined && value >= 1000) budget = value
    }

    if (days !== undefined) { draft.days = days; got.push(showDays(days)) }
    if (people !== undefined) { draft.people = people; got.push(people === 0 ? 'no helpers' : people === 1 ? '1 person' : `${people} people`) }
    if (budget !== undefined) { draft.budget = budget; got.push(`${taka(budget)} budget`) }
  }

  const next = SLOTS.find((s) => draft[s] === undefined)
  draft.asking = next
  const ready = draft.type !== undefined && draft.days !== undefined && draft.budget !== undefined
  const empty = SLOTS.every((s) => previous[s] === undefined)

  let ack = ''
  if (got.length) ack = `Got it: ${got.join(', ')}. `
  else if (empty) ack = /^(hi|hello|hey|salam|assalam)/.test(text) ? 'Hi! ' : 'Happy to help. '
  else ack = 'Sorry, I did not catch that. '

  const reply = next
    ? ack + ASK[next](draft)
    : `${got.length ? ack : ''}I have everything I need. Check the summary and press “Send for review” when you are ready.`
  return { reply, draft, ready }
}
