import { useState } from 'react'
import { Card, Btn, Badge, Title, field } from '../../vendor/ui'

const QUEUES: [string, number][] = [['Pending', 3], ['Newly generated', 2], ['Approved', 14], ['Rejected', 1], ['Needs replanning', 1]]
const JOBS = ['Move to the new flat', 'Farewell party', 'Weekend trip']

export default function Approvals() {
  const [q, setQ] = useState('Pending')
  const [job, setJob] = useState(JOBS[0])
  return (
    <>
      <Title title="Plan approvals" sub="Nothing reaches a client until you approve it." />
      <div className="mb-4 flex flex-wrap gap-2">{QUEUES.map(([n, c]) => <button key={n} onClick={() => setQ(n)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${q === n ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}>{n} ({c})</button>)}</div>
      <Card className="mb-6"><ul className="divide-y">{JOBS.map((j) => <li key={j}><button onClick={() => setJob(j)} className={`w-full rounded-lg px-2 py-3 text-left text-sm font-semibold ${job === j ? 'bg-(--tile)' : ''}`}>{j}</button></li>)}</ul></Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><h2 className="font-bold">{job}</h2>
          <p className="muted mt-1 text-sm">4 phases · 28 tasks (9 Must, 12 Should, 7 Nice)</p>
          <p className="mt-3 text-sm">Budget ৳ 18,500 of ৳ 20,000</p>
          <div className="mt-3"><Badge tone="green">Fits client deadline</Badge></div>
          <p className="mt-4 rounded-xl bg-(--bubble) p-3 text-xs">Companion notes: the crew booking is the main risk. Suggested hiring in week 1.</p></Card>
        <Card><h2 className="mb-3 font-bold">Decision</h2>
          <textarea rows="3" className={field} placeholder="Add a comment for the client or the companion" />
          <div className="mt-3 flex flex-wrap gap-2"><Btn>Accept and send to client</Btn><Btn variant="ghost">Reject and send back to the companion</Btn></div></Card>
      </div>
    </>
  )
}
