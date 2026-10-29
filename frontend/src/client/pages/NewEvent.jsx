import { useEffect, useRef, useState } from 'react'
import { Card, Btn, Title, field, taka } from '../../vendor/ui'
import { askCompanion, sendEvent } from '../../api/events'
const TYPE_NAME = { Moving: 'Moving home', Party: 'Party', Trip: 'Trip', Farewell: 'Farewell', Other: 'Something else' }
// Quick answers that fit the question the companion just asked.
const CHIPS = {
  type: ['Moving home', 'Birthday party', 'Road trip', 'Farewell'],
  days: ['1 week', '3 weeks', '1 month'],
  budget: ['৳ 10,000', '৳ 20,000', '৳ 50,000'],
  people: ['Just me', '2 helpers', '10 guests'],
  notes: ['No, that is all'],
}
const showTime = (d) =>
  d === undefined ? '—' : d >= 7 && d % 7 === 0 ? `${d / 7} week${d === 7 ? '' : 's'}` : `${d} day${d === 1 ? '' : 's'}`
const START = [{ me: false, t: 'Hi! What are we planning together?' }]
export default function NewEvent({ go }) {
  const [msgs, setMsgs] = useState(START)
  const [draft, setDraft] = useState({ asking: 'type' })
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const end = useRef(null)
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [msgs, typing])
  const filled = ['type', 'days', 'budget', 'people', 'notes'].filter((k) => draft[k] !== undefined).length
  const ready = draft.type !== undefined && draft.days !== undefined && draft.budget !== undefined
  const send = async (t) => {
    if (!t.trim() || typing) return
    setMsgs((m) => [...m, { me: true, t }])
    setText('')
    setTyping(true)
    setErr('')
    try {
      const r = await askCompanion(t, draft)
      setDraft(r.draft)
      setMsgs((m) => [...m, { me: false, t: r.reply }])
    } catch (e) {
      setMsgs((m) => [...m, { me: false, t: e instanceof Error ? e.message : 'Something went wrong. Please try again.' }])
    } finally {
      setTyping(false)
    }
  }
  const submit = async () => {
    setSending(true)
    setErr('')
    try {
      await sendEvent(draft)
      setSent(true)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not send. Please try again.')
    } finally {
      setSending(false)
    }
  }
  const again = () => {
    setMsgs(START)
    setDraft({ asking: 'type' })
    setSent(false)
    setErr('')
  }
  if (sent) {
    return (
      <>
        <Title title="Sent for review" sub="Our team reviews every plan before it is released to you." />
        <Card className="max-w-lg">
          <p className="font-bold">Your request is with our team.</p>
          <p className="muted mt-2 text-sm">
            You will see it on your dashboard as “Waiting for review”. Once it is approved, the plan appears in the Plan tab.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Btn onClick={() => go('dashboard')}>Go to dashboard</Btn>
            <Btn variant="ghost" onClick={again}>
              Plan another event
            </Btn>
          </div>
        </Card>
      </>
    )
  }
  const rows = [
    ['Event', draft.type ? TYPE_NAME[draft.type] : '—'],
    ['Time', showTime(draft.days)],
    ['People', draft.people === undefined ? '—' : String(draft.people)],
    ['Budget', draft.budget === undefined ? '—' : taka(draft.budget)],
  ]
  const chips = (draft.asking && CHIPS[draft.asking]) || []
  return (
    <>
      <Title title="New event" sub="Chat with your companion. It builds the plan, and our team reviews it before you see it." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="flex h-[28rem] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`pop max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.me ? 'ml-auto bg-(--primary) text-(--on-primary)' : 'bg-(--bubble) text-(--ink)'}`}
              >
                {m.t}
              </p>
            ))}
            {typing && <p className="muted text-xs">Companion is typing…</p>}
            <div ref={end} />
          </div>
          <div className="my-3 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button key={c} onClick={() => send(c)} className="rounded-full border px-3 py-1 text-xs hover:bg-(--tile)">
                {c}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(text)
            }}
            className="flex gap-2"
          >
            <input className={field} placeholder="Type your message" value={text} onChange={(e) => setText(e.target.value)} />
            <Btn type="submit" disabled={typing}>
              Send
            </Btn>
          </form>
        </Card>
        <Card>
          <h2 className="font-bold">Your request so far</h2>
          <dl className="mt-3 space-y-2 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="label mt-5">Details collected: {filled} of 5</p>
          <div className="mt-2 h-1.5 rounded-full bg-(--tile)">
            <div className="h-full rounded-full bg-(--primary) transition-all" style={{ width: `${filled * 20}%` }} />
          </div>
          {err && <p className="mt-3 rounded-lg bg-[#fde4ea] p-3 text-xs text-[#a13348]">{err}</p>}
          <Btn className="mt-5 w-full" disabled={!ready || sending} onClick={submit}>
            {sending ? 'Sending...' : 'Send for review'}
          </Btn>
          <p className="muted mt-2 text-xs">
            {ready
              ? 'Our team reviews every plan before it is released to you.'
              : 'Tell the companion the event, the time and your budget to unlock this.'}
          </p>
        </Card>
      </div>
    </>
  )
}
