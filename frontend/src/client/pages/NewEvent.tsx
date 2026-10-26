import { useState } from 'react'
import { Card, Btn, Title, field } from '../../vendor/ui'

const CHIPS = ['৳ 20,000 · Low cost', '3 weeks', '2 helpers']
const REPLIES = ['Lovely, a move. When do you need to be in?', 'Got it. What budget feels comfortable?', 'Thanks! Who can help you on the day?', 'Perfect. I have what I need.']

export default function NewEvent() {
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: 'Hi! What are we planning together?' }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const collected = Math.min(5, Math.ceil(msgs.length / 2) + 1)

  const send = (t: string) => {
    if (!t.trim() || typing) return
    setMsgs((m) => [...m, { me: true, t }]); setText(''); setTyping(true)
    setTimeout(() => { setMsgs((m) => [...m, { me: false, t: REPLIES[Math.min(m.length >> 1, 3)] }]); setTyping(false) }, 900)
  }
  return (
    <>
      <Title title="New event" sub="Chat with your companion. It builds the plan, and our team reviews it before you see it." />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="flex h-[28rem] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto">
            {msgs.map((m, i) => <p key={i} className={`pop max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.me ? 'ml-auto bg-(--primary) text-(--on-primary)' : 'bg-(--bubble) text-(--ink)'}`}>{m.t}</p>)}
            {typing && <p className="muted text-xs">Companion is typing…</p>}
          </div>
          <div className="my-3 flex flex-wrap gap-2">{CHIPS.map((c) => <button key={c} onClick={() => send(c)} className="rounded-full border px-3 py-1 text-xs hover:bg-(--tile)">{c}</button>)}</div>
          <form onSubmit={(e) => { e.preventDefault(); send(text) }} className="flex gap-2">
            <input className={field} placeholder="Type your message" value={text} onChange={(e) => setText(e.target.value)} /><Btn type="submit">Send</Btn>
          </form>
        </Card>
        <Card>
          <h2 className="font-bold">Your request so far</h2>
          <dl className="mt-3 space-y-2 text-sm">{[['Event', 'Moving home'], ['Time', '3 weeks'], ['Helpers', '2'], ['Budget', '৳ 20,000']].map(([k, v]) => <div key={k} className="flex justify-between"><dt className="muted">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
          <p className="label mt-5">Details collected: {collected} of 5</p>
          <div className="mt-2 h-1.5 rounded-full bg-(--tile)"><div className="h-full rounded-full bg-(--primary) transition-all" style={{ width: `${collected * 20}%` }} /></div>
          <Btn className="mt-5 w-full">Send for review</Btn>
          <p className="muted mt-2 text-xs">Our team reviews every plan before it is released to you.</p>
        </Card>
      </div>
    </>
  )
}
