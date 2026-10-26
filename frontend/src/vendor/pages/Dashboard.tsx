import type { Store } from '../useStore'
import Img from '../../shared/Img'
import { Card, Btn, Badge, Title, Stat, taka, statusTone } from '../ui'

export default function Dashboard({ s, go }: { s: Store; go: (id: string) => void }) {
  const active = s.jobs.filter((j) => j.status !== 'Delivered')
  const done = s.jobs.filter((j) => j.status === 'Delivered')
  const earned = done.reduce((t, j) => t + j.price, 0)
  return (
    <>
      <Title title={`Welcome back, ${s.profile.name}`} sub={`${s.requests.length} new requests and ${active.length} jobs in progress.`}>
        <Badge tone="green">Verified provider</Badge>
      </Title>
      <Img src="/images/vendors/flowers.jpg" alt="Providers at work" emoji="🧰" className="mb-6 h-40 w-full rounded-xl text-3xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="New requests" value={s.requests.length} />
        <Stat label="Active jobs" value={active.length} />
        <Stat label="Completed" value={done.length} />
        <Stat label="Earned this month" value={taka(earned)} note="Payments are simulated" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Booking requests</h2><Btn variant="ghost" onClick={() => go('requests')}>See all</Btn></div>
          {s.requests.length === 0 && <p className="muted text-sm">No new requests right now.</p>}
          <ul className="divide-y">
            {s.requests.slice(0, 3).map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-3">
                <div className="flex-1"><p className="text-sm font-semibold">{r.pack}</p><p className="muted text-xs">{r.client}, {r.date}, {taka(r.budget)}</p></div>
                <Btn onClick={() => s.accept(r.id)}>Accept</Btn><Btn variant="ghost" onClick={() => s.decline(r.id)}>Decline</Btn>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Active jobs</h2><Btn variant="ghost" onClick={() => go('jobs')}>Manage</Btn></div>
          {active.length === 0 && <p className="muted text-sm">No active jobs.</p>}
          <ul className="space-y-4">
            {active.map((j) => (
              <li key={j.id}>
                <div className="flex items-center justify-between"><p className="text-sm font-semibold">{j.pack}</p><Badge tone={statusTone[j.status]}>{j.status}</Badge></div>
                <p className="muted text-xs">Client: {j.client}</p>
                <div className="mt-2 h-1.5 rounded-full bg-(--tile)"><div className="h-full rounded-full bg-(--primary)" style={{ width: `${j.progress}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
