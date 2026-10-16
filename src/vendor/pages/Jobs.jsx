import { Card, Badge, Title, taka, statusTone } from '../ui'

const STATUSES = ['Accepted', 'In progress', 'Delivered']

export default function Jobs({ s }) {
  return (
    <>
      <Title title="Active jobs" sub="Update the status so your client can follow the progress." />
      <Card>
        {s.jobs.length === 0 && <p className="muted text-sm">No jobs yet.</p>}
        <ul className="divide-y">
          {s.jobs.map((j) => (
            <li key={j.id} className="flex flex-wrap items-center gap-4 py-4">
              <div className="min-w-48 flex-1">
                <p className="text-sm font-semibold">{j.pack}</p>
                <p className="muted text-xs">Client: {j.client}, {taka(j.price)}</p>
                <div className="mt-2 h-1.5 rounded-full bg-(--tile)"><div className="h-full rounded-full bg-(--primary) transition-all" style={{ width: `${j.progress}%` }} /></div>
              </div>
              <Badge tone={statusTone[j.status]}>{j.status}</Badge>
              <select aria-label="Job status" value={j.status} onChange={(e) => s.setStatus(j.id, e.target.value)} className="rounded-lg border bg-(--card) px-2 py-1.5 text-xs">
                {STATUSES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}
